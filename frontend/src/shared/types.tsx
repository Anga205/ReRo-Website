interface websocketContext {
    ws: WebSocket | null;
    status: "connected" | "disconnected";
}

export type { websocketContext };
