const WebSocket = require('ws');

module.exports = function (server) {
  const wss = new WebSocket.Server({ server });

  // Store clients and their subscribed topics
  const clients = new Map();

  // Broadcast a message to all clients subscribed to a topic
  function broadcast(topic, message) {
    clients.forEach((topics, client) => {
      if (topics.has(topic) && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ topic, message }));
      }
    });
  }

  // Add a client and handle its messages
  wss.on('connection', (ws) => {
    clients.set(ws, new Set());

    ws.on('message', (message) => {
      const { type, topic } = JSON.parse(message);

      if (type === 'subscribe') {
        clients.get(ws).add(topic);
      } else if (type === 'unsubscribe') {
        clients.get(ws).delete(topic);
      }
    });

    ws.on('close', () => {
      clients.delete(ws);
    });
  });

  // Return an object with the broadcast function and the WebSocket server instance
  return {
    broadcast,
    wss,
  };
};
