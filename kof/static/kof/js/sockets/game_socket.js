import { Kyo } from "../players/kyo.js";

export class GameSocket {
    constructor(kof, uuid) {
        this.kof = kof;
        this.ws = new WebSocket("ws://106.15.0.62:8000/kof/wss/game/");
        this.uuid = uuid;
        this.state = false;

        this.start();
    }

    get_player(uuid) {
        let players = this.kof.players;
        for (let i = 0; i < players.length; i++) {
            let player = players[i];
            if (player.uuid === uuid)
                return player;
        }
        return null;
    }


    send_location(uuid, x, y, status) {
        this.ws.send(JSON.stringify({
            'event': 'location',
            'uuid': uuid,
            'x': x,
            'y': y,
            'status': status,
        }));
    }

    receive_location(uuid, x, y, status) {
        let player = this.get_player(uuid);
        player.move_to(x, y, status);
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
            if (uuid === outer.uuid)
                return false;
            if (event === 'create_player') {
                let order = data.order;
                outer.receive_create_player(uuid, order);
            } else if (event === 'location') {
                let uuid = data.uuid;
                let x = data.x;
                let y = data.y;
                let status = data.status;
                outer.receive_location(uuid, x, y, status);
            }
        }
    }

    start() {
        this.receive();
    }
}