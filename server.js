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
        // 執行 vcgencmd 命令獲取 CPU 溫度
        const tempOutput = execSync('vcgencmd measure_temp').toString();
        const tempMatch = tempOutput.match(/temp=([\d.]+)/); // 使用正規表達式抓取溫度數值

        if (tempMatch && tempMatch[1]) {
            return parseFloat(tempMatch[1]); // 轉換成浮點數並返回
        } else {
            console.error('Failed to parse CPU temperature.');
            return 0; // 若解析失敗，返回一個默認值
        }
    } catch (error) {
        console.error('Error reading CPU temperature:', error.message);
        return 0; // 如果命令執行失敗，返回一個默認值
    }
}

// start on port 5472
const PORT = process.env.PORT || 5472;
server.listen(PORT, () => {
    console.log(`server is running at http://localhost:${PORT}`);
});
