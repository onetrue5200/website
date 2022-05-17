import { Object } from "./object.js";

export class Player extends Object {
    constructor(map, info) {
        super();

        this.map = map;
        this.ctx = this.map.ctx;

        this.order = info.order;

        this.x = info.x;
        this.y = info.y;
        this.width = info.width;
        this.height = info.height;
        this.color = info.color;

        this.vx = 0;
        this.vy = 0;

        this.speedx = 400;
        this.speedy = -1000;

        this.gravity = 50;

        this.direction = 1;  // 1 means right

        this.status = 3;  // 0: default, 1: forward, 2: backward, 3: jump, 4: attack, 5: attacked, 6: dead

        this.pressed_keys = this.map.controler.pressed_keys;
        this.is_pressed = false;

        this.animations = new Map();
        this.frame_current_cnt = 0;
    }

    move_to(x, y, status) {
        this.x = x;
        this.y = y;
        this.status = status;
    }

    start() {
        if (this.map.players.length >= 2)
            this.map.start_fighting(this.order);
    }

    render() {
        // draw the player
        // this.ctx.fillStyle = this.color;
        // this.ctx.fillRect(this.x, this.y, this.width, this.height);
        let status = this.status;
        if (status == 1 && this.direction * this.vx < 0) status = 2;
        let animation = this.animations.get(status);
        if (animation && animation.loaded) {
            if (this.direction > 0) {
                let k = parseInt(this.frame_current_cnt / animation.frame_rate) % animation.frame_cnt;
                let image = animation.gif.frames[k].image;
                this.ctx.drawImage(image, this.x, this.y + animation.offset_y, image.width * animation.scale, image.height * animation.scale);
            } else {
                this.ctx.save();

                this.ctx.scale(-1, 1);
                this.ctx.translate(-this.map.$canvas.width(), 0);

                let k = parseInt(this.frame_current_cnt / animation.frame_rate) % animation.frame_cnt;
                let image = animation.gif.frames[k].image;
                this.ctx.drawImage(image, this.map.$canvas.width() - this.x - this.width, this.y + animation.offset_y, image.width * animation.scale, image.height * animation.scale);

                this.ctx.restore();
            }
        } else {
            // this.ctx.fillStyle = this.color;
            // this.ctx.fillRect(this.x, this.y, this.width, this.height);
        }
        if (status === 4 && this.frame_current_cnt === animation.frame_rate * (animation.frame_cnt - 1)) {
            this.status = 0;
        }
        this.frame_current_cnt++;
    }

    update_move() {
        if (this.status === 3) {
            this.vy += this.gravity;  // v = v + a * t
            this.is_pressed = true;  // in the air == pressing
        }
        // s = v * t
        this.x += this.vx * this.timedelta / 1000;
        this.y += this.vy * this.timedelta / 1000;
        // ground
        if (this.y > 450) {
            this.vy = 0;
            this.y = 450;
            this.status = 0;
            this.is_pressed = false;
        }
        // map border
        if (this.x < 0) {
            this.x = 0;
        } else if (this.x + this.width > this.ctx.canvas.width) {
            this.x = this.ctx.canvas.width - this.width;
        }
        // sync the move
        if (this.map.game_socket.uuid === this.uuid && this.is_pressed && this.map.game_socket.state === true)
            this.map.game_socket.send_location(this.uuid, this.x, this.y, this.status);
    }

    update_control() {
        if (this.map.state != 'fighting')
            return;

        let w = this.pressed_keys.has('w');
        let a = this.pressed_keys.has('a');
        let d = this.pressed_keys.has('d');
        let space = this.pressed_keys.has(' ');
        if (w || a || d || space) {
            this.is_pressed = true;
        } else {
            this.is_pressed = false;
        }

        if (this.uuid === this.map.players[0].uuid) {  // only you can move by controler
            if (this.status === 0 || this.status === 1) {
                if (space) {  // attack
                    this.status = 4;
                    this.vx = 0;
                    this.frame_current_cnt = 0;
                } else if (w) {  // jump
                    if (d) {  // & move forward
                        this.vx = this.speedx;
                    } else if (a) {  // & move backward
                        this.vx = -this.speedx;
                    } else {  // mo move
                        this.vx = 0;
                    }
                    this.vy = this.speedy;
                    this.status = 3;
                    this.frame_current_cnt = 0;
                } else if (d) {  // move forward
                    this.vx = this.speedx;
                    this.status = 1;
                } else if (a) {  // move backward
                    this.vx = -this.speedx;
                    this.status = 1;
                } else {  // stand
                    this.vx = 0;
                    this.status = 0;
                }
            }
        }
    }

    update_direction() {
        let players = this.map.players;
        if (players[0] && players[1]) {
            let me = this;
            let you;
            if (me === players[0]) you = players[1];
            else you = players[0];
            if (me.x < you.x) me.direction = 1;
            else me.direction = -1;
        }
    }

    update() {
        this.update_control();
        this.update_move();
        this.update_direction();
        this.render();
    }
}