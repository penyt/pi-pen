# pi-pen
A simple web app monitoring temperature of your raspberry pi.

Docker image still testing...

# Usage
main code:  
  
**pi-pen**
├ [server.js](https://github.com/penyt/pi-pen/blob/main/server.js)  
└ public  
$emsp └ [index.html](https://github.com/penyt/pi-pen/blob/main/public/index.html)  
  
Run `node server.js` in the pi-pen directory, the service will be running on port 5472.  

Go to http://localhost:5472 to monitor temperature of you raspberry pi. 


# Run it in baskground
Using [PM2](https://pm2.io/docs/runtime/guide/installation/),  you may run the app in background.  

if there is no PM2 installed, use npm to install(official method)
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
  
  
