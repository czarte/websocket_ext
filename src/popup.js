document.getElementById("send").addEventListener("click", () => {
  sendWebSocketMessage("Hello from popup!");
});

function sendWebSocketMessage(data) {
  chrome.runtime.sendMessage(
    {
      type: "ws_send",
      payload: data
    },
    (response) => {
      if (response.status === "sent") {
        console.log("Message sent to WebSocket");
      } else {
        console.error("WebSocket error:", response.error);
      }
    }
  );
}

// Usage
sendWebSocketMessage("Hello from popup!");
