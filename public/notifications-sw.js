self.addEventListener("push", async event => {
  const data = event.data.json();

  clients.matchAll().then(function(clients) {
    console.log("Posting message...");
    clients[0].postMessage(data);
  });
});
