import { Kyo } from "../players/kyo.js";

export class GameSocket {
    constructor(kof) {
        this.kof = kof;
        this.ws = new WebSocket("ws://106.15.0.62:8000/kof/wss/game/");
        this.uuid = this.kof.players[0].uuid;

        this.start();
    }


    send_create_player() {
        this.ws.send(JSON.stringify({
            'event': 'create_player',
            'uuid': this.uuid,
        }));
    }

    receive_create_player(uuid) {
        let player = new Kyo(this.kof, {
            x: 500,
            y: 0,
            width: 120,
            height: 200,
            color: 'red',
        });
        player.uuid = uuid;
        this.kof.players.push(player);
    }

    receive() {
        let outer = this;
        this.ws.onmessage = function (e) {
            let data = JSON.parse(e.data);
            let event = data.event;
            let uuid = data.uuid;
            if (uuid === outer.uuid)
                return false;
            if (event === 'create_player') {
                outer.receive_create_player(uuid);
            }
        }
    }

    start() {
        this.receive();
    }
}