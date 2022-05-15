export class GameSocket {
    constructor(kof) {
        this.kof = kof;
        this.ws = new WebSocket("ws://106.15.0.62/kof/wss/game/");
    }
}