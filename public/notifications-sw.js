self.addEventListener("push", event => {
  const data = event.data.json();
  console.log("New notification", data);
});
