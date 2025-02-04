const express = require('express');
const { Server } = require('socket.io');
const http = require('http');
const fs = require('fs');
const path = './temperatureData.json';
const { execSync } = require('child_process');


const app = express();
const server = http.createServer(app);
const io = new Server(server);

// frontend
app.use(express.static('public'));

// initialize data
let temperatureData = [];
if (fs.existsSync(path)) {
    try {
        const fileData = fs.readFileSync(path, 'utf8');
        temperatureData = JSON.parse(fileData) || [];
    } catch (err) {
        console.error('Failed to read data from file:', err);
    }
}

// get temperature every 5 sec
setInterval(() => {
    const temperature = getCPUTemperature();
    const currentTime = Date.now();
    temperatureData.push({ time: currentTime, temperature }); // formatting
    const oneDayAgo = currentTime - 24 * 60 * 60 * 1000; // 24hr data at most
    temperatureData = temperatureData.filter(data => data.time > oneDayAgo);

    // write into json file
    try {
        fs.writeFileSync(path, JSON.stringify(temperatureData), 'utf8');
    } catch (err) {
        console.error('Failed to save data to file:', err);
    }
}, 5000);

// get temperature
app.get('/api/temperature/history', (req, res) => {
    res.json(temperatureData);
});

// WebSocket 通信用於實時溫度監控
io.on('connection', (socket) => {
    console.log('Client is connected');

    // send data every 5 sec
    const interval = setInterval(() => {
        if (temperatureData.length > 0) {
            const latestTemperature = temperatureData[temperatureData.length - 1];
            socket.emit('temperatureUpdate', { temperature: latestTemperature.temperature });
        }
    }, 5000);

    socket.on('disconnect', () => {
        clearInterval(interval);
        console.log('Client loses connection :(');
    });
});

// get Pi temperature
//function getCPUTemperature() {
//    return Math.floor(Math.random() * (60 - 30 + 1)) + 30;
//}
function getCPUTemperature() {
    try {
        console.log('Attempting to read /sys/class/thermal/thermal_zone0/temp...');
        const temp = fs.readFileSync('/sys/class/thermal/thermal_zone0/temp', 'utf8');
        return parseFloat(temp) / 1000; // 轉換為攝氏溫度
    } catch (error) {
        console.error('Failed to read CPU temperature:', error.message);
        return 0;
    }
}

// start on port 5472
const PORT = process.env.PORT || 5472;
server.listen(PORT, () => {
    console.log(`server is running at http://localhost:${PORT}`);
});
