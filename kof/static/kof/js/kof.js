import { Map } from "./map.js";
import { Kyo } from "./players/kyo.js";
import { GameSocket } from "./sockets/game_socket.js";

// the kof game class
export class KOF {
    constructor(id) {
        this.$kof = $('#' + id);
        // create a map
        this.map = new Map(this);
        // create two players
        this.players = [
            new Kyo(this, {
                id: 0,
                x: 200,
                y: 0,
                width: 120,
                height: 200,
                color: 'blue',
            }),
            new Kyo(this, {
                id: 1,
                x: 800,
                y: 0,
                width: 120,
                height: 200,
                color: 'red',
            }),
        ];
        // create game socket
        this.game_socket = new GameSocket(this);
    }
}