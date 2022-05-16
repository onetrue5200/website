import { Map } from "./map.js";
import { Kyo } from "./players/kyo.js";
import { GameSocket } from "./sockets/game_socket.js";

// the kof game class
export class KOF {
    constructor(id) {
        let outer = this;
        this.$kof = $('#' + id);
        // create a map
        this.map = new Map(this);
        // create two players
        this.players = []
        this.players.push(new Kyo(this, {
            x: 200,
            y: 0,
            width: 120,
            height: 200,
            color: 'blue',
        }));
        // create game socket
        this.game_socket = new GameSocket(this);
        this.game_socket.ws.onopen = function () {
            outer.game_socket.send_create_player();
        }
    }
}