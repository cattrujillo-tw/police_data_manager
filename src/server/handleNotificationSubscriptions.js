let clients = [];

export const streamNotifications = (req, res, next) => {
  // Same as Auth0 Token Expiration
  res.setTimeout(10 * 60 * 60 * 1000);

  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Connection", "keep-alive");
  // only set this header in local
  res.setHeader("Access-Control-Allow-Origin", "https://localhost");

  res.flushHeaders();

  // After client opens connection send all nests as string
  const clientEmail = req.nickname;
  const message = `${clientEmail} has subscribed to notifications.`;
  res.write(`data: ${JSON.stringify(message)} \n\n`);

  console.log("made connection and sent data from stream notifications");

  const newClient = {
    id: clientEmail,
    res
  };

  // replace any old connect with new connection if client is in clients array already
  let isNewClient = true;
  clients = clients.map(client => {
    if (client.id === newClient.id) {
      console.log("Client was replaced.");
      isNewClient = false;
      return newClient;
    } else {
      return client;
    }
  });
  if (isNewClient) {
    console.log("This is a new client");
    clients.push(newClient);
  }

  clients.map(client => console.log("ID", client.id));

  // When client closes connection we update the clients list
  // avoiding the disconnected one
  req.on("close", () => {
    console.log(`${clientEmail} Connection closed`);
    clients = clients.filter(c => c.id !== clientEmail);
  });
};

// Iterate clients list and use write res object method to send new nest
export const sendNotification = message => {
  clients.forEach(c => c.res.write(`data: ${JSON.stringify(message)}\n\n`));
};
