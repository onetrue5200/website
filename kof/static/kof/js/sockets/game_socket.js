export class GameSocket {
    constructor(kof) {
        this.kof = kof;
        this.ws = new WebSocket("ws://106.15.0.62:8000/kof/wss/game/");
    }

    send_create_player() {
        this.ws.send(JSON.stringify({
            'message': "hello",
        }));
    }

    receive_create_player() {

    }
}