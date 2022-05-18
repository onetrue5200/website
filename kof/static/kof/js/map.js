import { Object } from "./object.js";
import { Controler } from "./controler.js";
import { Kyo } from "./players/kyo.js";
import { GameSocket } from "./sockets/game_socket.js";

export class Map extends Object {
    constructor(kof) {
        super();

        let outer = this;

        this.kof = kof;

        this.$canvas = $('<canvas width="1280" height="720" tabindex=0></canvas>');
        this.$canvas.focus();  // tabindex=0 to focus the canvas(listen to key)
        this.ctx = this.$canvas[0].getContext('2d');

        this.kof.$kof.append(this.$canvas);

        // infobar
        this.$infobar = this.kof.$kof.find('.info-bar');
        this.$infobar.hide();

        // timer
        this.$timer = this.kof.$kof.find('.timer');

        // create a controler
        this.controler = new Controler(this.$canvas);

        // game state
        this.state = 'waiting';

        // player list
        this.players = [];

        this.start();
    }

    start_fighting(order) {
        this.players[order].x = 880;
        this.players[1 - order].x = 200;
        this.players[order].id = 0;  // set id
        this.players[1 - order].id = 1;  // set id
        // left player 1
        this.players[1 - order].$hp = this.kof.$kof.find(`.player1 .player-hp`);
        // right player 0
        this.players[order].$hp = this.kof.$kof.find(`.player0 .player-hp`);
        this.players[1 - order].$hp.css('width', '100%');
        this.players[order].$hp.css('width', '100%');

        this.$infobar.show();
        this.time = 60000;

        this.state = 'fighting';
    }

    create_socket(uuid) {
        // create game socket
        this.game_socket = new GameSocket(this, uuid);
    }

    add_player() {
        let player = new Kyo(this, {
            order: 0,
            x: 580,
            y: 450,
            width: 120,
            height: 200,
            color: 'blue',
        });
        this.players.push(player);
        return player.uuid;
    }

    render() {
        // clear the map before drawing the new one
        this.ctx.clearRect(0, 0, this.$canvas.width(), this.$canvas.height());
        // draw the map
        // this.ctx.fillStyle = 'black';
        // this.ctx.fillRect(0, 0, this.$canvas.width(), this.$canvas.height());
    }

    update_timer() {
        if (this.state == 'fighting') {
            this.time -= this.timedelta;
            if (this.time < 0) this.time = 0;
            this.$timer.text(parseInt(this.time / 1000));
        }
    }

    update() {
        this.update_timer();
        this.render();
    }

    show() {
        this.kof.$kof.css('background-image', "url('/static/kof/image/background/02.gif')");
        this.$canvas.show();
    }

    hide() {
        this.kof.$kof.css('background-image', "");
        this.$canvas.hide();
    }


    start() {
        this.hide();
    }
}