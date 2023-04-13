const WebSocket = require('ws');

module.exports = function(server) {
  const wss = new WebSocket.Server({ server });

  // Broadcast data to all connected clients
  wss.broadcast = function broadcast(event, data) {
    const message = JSON.stringify({ event, data });
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  };

  wss.on('connection', (ws, req) => {
    ws.on('message', message => {
      try {
        const parsedMessage = JSON.parse(message);
        const { event, data } = parsedMessage;

        // Handle custom events here, e.g., joining specific channels or sending direct messages

      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    });

    ws.on('close', () => {
      // Handle WebSocket disconnections, e.g., cleanup or user notifications
    });

    // Send welcome message
    ws.send(JSON.stringify({ event: 'welcome', data: { message: 'Welcome to the WebSocket server!' } }));
  });

  return wss;
};

// ---------
// Inside the oracles.js and requests.js files, after creating new resources
// wss.broadcast('newRequest', newRequest);

// Inside the responses.js file, after creating new resources
// wss.broadcast('newResponse', newResponse);
