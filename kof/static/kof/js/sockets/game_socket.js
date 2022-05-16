import { Kyo } from "../players/kyo.js";

export class GameSocket {
    constructor(kof, uuid) {
        this.kof = kof;
        this.ws = new WebSocket("ws://106.15.0.62:8000/kof/wss/game/");
        this.uuid = uuid;

        this.start();
    }

    send_create_player() {
        this.ws.send(JSON.stringify({
            'event': 'create_player',
            'uuid': this.uuid,
        }));
    }

    receive_create_player(uuid, order) {
        let player = new Kyo(this.kof, {
            order: order,
            x: 580,
            y: 450,
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
            let order = data.order;
            if (uuid === outer.uuid)
                return false;
            if (event === 'create_player') {
                outer.receive_create_player(uuid, order);
            }
        }
    }

    start() {
        this.receive();
    }
}