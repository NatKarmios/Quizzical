
const TWITCH_CHAT_URL = 'wss://irc-ws.chat.twitch.tv:443';
const NICK = 'natkarmios'; // TODO: REMOVE
const OAUTH = 'oauth:sv99hvqqr6b0rjsinzp3i1akp8ltdf';  // TODO: REMOVE
const CHANNEL = 'natkarmios'; // TODO: REMOVE

let socket: WebSocket;
const listeners: Array = [msg => { console.log(`> ${msg}`); }];

export function sendRaw(msg) {
  console.log(`< ${msg}`);
  socket.send(msg);
}

function login() {
  sendRaw(`PASS ${OAUTH}`);
  sendRaw(`NICK ${NICK}`);
  sendRaw(`JOIN #${CHANNEL}`);
}

export function close() {
  socket.close();
}

export function onMessage(func: () => void) {
  listeners.push(func);
}

export function connect() {
  return new Promise(resolve => {
    socket = new WebSocket(TWITCH_CHAT_URL);
    socket.addEventListener('open', () => {
      login();
      resolve();
    });
    socket.addEventListener('message', event => { listeners.forEach(func => { func(event.data); }); });
  });
}
