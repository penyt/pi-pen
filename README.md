# pi-pen
A simple web app monitoring temperature of your raspberry pi.
<img width="1120" alt="10min-bigscreen" src="https://github.com/user-attachments/assets/318254b7-477a-40db-9d22-3f013fb6c525" />

DEMO: https://pi-pen.penli.quest  

Docker image still testing... 2025/04/21 FINISHED  

## Usage -- Docker Container

docker run:  
```
docker run -d --name pi-pen -p 5472:5472 penyt/pi-pen
```

docker-compose.yml
```
services:
    pi-pen:
        image: penyt/pi-pen
        ports:
            - '5472:5472'
        container_name: pi-pen
```

Then use ```docker ps``` to check container  

On your browser, type in http://localhost:5472 to get to your pi-pen monitor of your pi !!  


## Usage -- node.js
main code:  
  
**pi-pen**  
├ [server.js](https://github.com/penyt/pi-pen/blob/main/server.js)    
└ public  
&emsp; └ [index.html](https://github.com/penyt/pi-pen/blob/main/public/index.html)  
  
Run `node server.js` in the pi-pen directory, the service will be running on port 5472.  

Go to http://localhost:5472 to monitor temperature of you raspberry pi. 


## Run it in background
Using [PM2](https://pm2.io/docs/runtime/guide/installation/),  you may run the app in background.  

If there is no PM2 installed, use npm to install(official method)
```
npm install pm2 -g
```

Then, head into `pi-pen` directory, `cd /path/to/pi-pen`, run 
```
pm2 start server.js
```

Check status
```
pm2 status
```

Check logs
```
pm2 logs
```  
  
  
