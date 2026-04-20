// utils/Socket.ts
// React Native compatible WebSocket client (Singleton) — TypeScript version

type Callback = (data: any) => void;

class SocketClient {
    private ws: WebSocket | null = null;
    private email: string | null = null;
    private baseUrl: string | null = null;
    private listeners: Record<string, Callback[]> = {};
    private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    private manualDisconnect: boolean = false;

    connect(baseUrl: string, email: string): void {
        this.baseUrl = baseUrl;
        this.email = email;
        this.manualDisconnect = false;

        // ✅ Use 1 instead of WebSocket.OPEN (RN me static constants kaam nahi karte)
        if (this.ws && this.ws.readyState === 1) return;

        // Convert http:// or https:// → ws:// or wss://
        const wsUrl =
            baseUrl.replace(/^http/, "ws") +
            `/ws?email=${encodeURIComponent(email)}`;

        console.log("WS connecting to:", wsUrl);

        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
            console.log("✅ WS connected:", email);
            if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
        };

        this.ws.onmessage = (e: WebSocketMessageEvent) => {
            try {
                const { event, data } = JSON.parse(e.data);
                const callbacks = this.listeners[event];
                if (callbacks) callbacks.forEach((cb) => cb(data));
            } catch (err) {
                console.error("WS parse error:", err);
            }
        };

        this.ws.onerror = (err: Event) => {
            console.error("WS error:", err);
        };

        this.ws.onclose = () => {
            console.log("WS closed");
            if (!this.manualDisconnect && this.email && this.baseUrl) {
                console.log("Reconnecting in 3s...");
                this.reconnectTimer = setTimeout(() => {
                    this.connect(this.baseUrl!, this.email!);
                }, 3000);
            }
        };
    }

    emit(event: string, data: any): void {
        // ✅ Use 1 instead of WebSocket.OPEN
        if (this.ws && this.ws.readyState === 1) {
            this.ws.send(JSON.stringify({ event, data }));
        } else {
            console.warn("WS not open, cannot emit:", event);
        }
    }

    on(event: string, callback: Callback): void {
        if (!this.listeners[event]) this.listeners[event] = [];
        // Avoid duplicate listeners
        if (!this.listeners[event].includes(callback)) {
            this.listeners[event].push(callback);
        }
    }

    off(event: string, callback: Callback): void {
        if (!this.listeners[event]) return;
        this.listeners[event] = this.listeners[event].filter(
            (cb) => cb !== callback
        );
    }

    disconnect(): void {
        this.manualDisconnect = true;
        if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
        if (this.ws) {
            this.ws.onclose = null; // prevent auto-reconnect on manual disconnect
            this.ws.close();
            this.ws = null;
        }
        this.email = null;
    }
}

// Singleton — same instance reused across all screens
const socket = new SocketClient();
export default socket;