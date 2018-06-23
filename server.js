const WebSocket = require('ws');
let redis = require('redis');
let client = redis.createClient();
console.log(client);

let clientsArr = [];

const wss = new WebSocket.Server({
    port: 3000
});

let _data = [{
	value: '我是aaa',
	fontSize: 20,
	color: 'gold',
	speed: 2
}]


wss.on('connection', function (ws) {
	clientsArr.push(ws);
	client.lrange('barrages', 0, -1, function(err,applies) {
		applies = applies.map(item => JSON.parse(item));
		ws.send(JSON.stringify({
		  	type:'INIT',
		  	data: applies
		}));
	})
    console.log(`[SERVER] connection()`);
    ws.on('message', function (message) {
		client.rpush('barrages', message, redis.print);
		clientsArr.forEach(w=>{
			w.send(JSON.stringify({ type: 'ADD', data: JSON.parse(message) }), err => {
				if (err){
					console.log(`[server] error: ${err}`)
				};
		})
        console.log(`[SERVER] Received: ${message}`);
		// ws.send(JSON.stringify(_data), (err) => {
		// 	if (err) {
		// 		console.log(`[SERVER] error: ${err}`);
		// 	}
		// });
	})
	ws.on('close', function () {
		clientsArr = clientsArr.filter(client => client != ws)
	})
});

console.log('ws server started at port 3000...');

// client test:

// let ws = new WebSocket('ws://localhost:3000/ws/chat');

// let count = 0;

// ws.on('open', function () {
//     console.log(`[CLIENT] open()`);
//     ws.send('Hello!');
// });

// ws.on('message', function (message) {
//     console.log(`[CLIENT] Received: ${message}`);
//     count++;
//     if (count > 3) {
//         ws.send('Goodbye!');
//         ws.close();
//     } else {
//         setTimeout(() => {
//             ws.send(`Hello, I'm Mr No.${count}!`);
//         }, 1000);
//     }
// });