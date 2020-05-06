let clients = [];

export const streamNotifications = (req, res, next) => {
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Connection", "keep-alive");
  // only set this header in local
  res.setHeader("Access-Control-Allow-Origin", "https://localhost");

  res.flushHeaders();

  // After client opens connection send all nests as string
  const data = `data: ${JSON.stringify("Made connection with client")}\n\n`;
  res.write(data);
  const clientEmail = req.nickname;
  const message = `${clientEmail} has subscribed to notifications.`;
  res.write(`data: ${JSON.stringify(message)} \n\n`);

  console.log("sent data from stream notifications");

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
  //sendEventsToAll("updating my SSE after clients added")

  //   const intervalId = setInterval(() => {
  //     res.write(`data: ${JSON.stringify(keep connection alive)}\n\n`);
  //     res.flush();
  //   }, 60 * 1000);
  //
  //   req.on('close', () => {
  //     // Make sure to clean up after yourself when the connection is closed
  //     clearInterval(intervalId);
  //   });
};

// Iterate clients list and use write res object method to send new nest
export const sendNotification = newNest => {
  clients.forEach(c => c.res.write(`data: ${JSON.stringify(newNest)}\n\n`));
};
