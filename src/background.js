let socket = null;

function connectWebSocket() {
    socket = new WebSocket("ws://localhost:5333", "MASQNode-UIv2"); // Update with your actual service

    socket.onopen = () => {
        console.log("[Service Worker] WebSocket connected");
        setInterval(idleWebSocketMessage, 3000);
    };

    socket.onmessage = (event) => {
        console.log("[Service Worker] Message from server:", event.data);
    };

    socket.onclose = () => {
        console.log("[Service Worker] WebSocket closed");
        // Optional: Reconnect logic
    };

    socket.onerror = (error) => {
        console.error("[Service Worker] WebSocket error:", error);
    };
}

connectWebSocket();

function idleWebSocketMessage() {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send("idle");
      console.log("[Service Worker]  idle sent");
    } else {
      console.log("[Service Worker] Idle error");
    }
}

// Message handler to respond to other parts of the extension
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "ws_send") {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(message.payload);
            sendResponse({ status: "sent" });
        } else {
            sendResponse({ status: "error", error: "Socket not connected" });
        }
        return true; // keep response channel open
    }
});

function closeWebSocket() {
  if (socket) {
    console.log("[Service Worker] Closing WebSocket before suspend...");
    socket.close();
    socket = null;
  }
}

chrome.runtime.onSuspend.addListener(() => {
  console.log("[Service Worker] Suspending background script...");
  closeWebSocket();
});