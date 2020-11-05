const ws = new WebSocket("ws://127.0.0.1:4000");

const wsinit = document.getElementById("wsinit");
const online = document.getElementById("online")

const data = {
  id: 1,
  name: "Ivan"
};

const closews = () => {
  ws.close()
}

ws.onopen = () => {
  console.log("opened ws");
};

ws.onmessage = msg => {
  console.log("msg", msg);
  wsinit.innerHTML += msg.data;
};

setTimeout(() => {
  console.log("sending hi");
  ws.send(JSON.stringify(data));
}, 5000);

setInterval(() => {
  if(ws.readyState === ws.OPEN) {
    online.setAttribute('class', 'online')
  } else {
    online.setAttribute('class', 'offline')
  }
}, 5000)