import { Object } from "./object.js";

export class Player extends Object {
    constructor(kof, info) {
        super();

        this.kof = kof;
        this.ctx = this.kof.map.ctx;

        this.id = info.id;
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

        this.pressed_keys = this.kof.map.controler.pressed_keys;

        this.animations = new Map();
        this.frame_current_cnt = 0;
    }

    start() { }

    render() {
        // draw the player
        //this.ctx.fillStyle = this.color;
        //this.ctx.fillRect(this.x, this.y, this.width, this.height);
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
                this.ctx.translate(-this.kof.map.$canvas.width(), 0);

                let k = parseInt(this.frame_current_cnt / animation.frame_rate) % animation.frame_cnt;
                let image = animation.gif.frames[k].image;
                this.ctx.drawImage(image, this.kof.map.$canvas.width() - this.x - this.width, this.y + animation.offset_y, image.width * animation.scale, image.height * animation.scale);

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
        }
        // s = v * t
        this.x += this.vx * this.timedelta / 1000;
        this.y += this.vy * this.timedelta / 1000;
        // ground
        if (this.y > 450) {
            this.vy = 0;
            this.y = 450;
            this.status = 0;
        }
        // map border
        if (this.x < 0) {
            this.x = 0;
        } else if (this.x + this.width > this.ctx.canvas.width) {
            this.x = this.ctx.canvas.width - this.width;
        }
    }

    update_control() {
        let w, a, d, space;
        if (this.id === 0) {
            w = this.pressed_keys.has('w');
            a = this.pressed_keys.has('a');
            d = this.pressed_keys.has('d');
            space = this.pressed_keys.has(' ');
        } else if (this.id === 1) {
            w = this.pressed_keys.has('ArrowUp');
            a = this.pressed_keys.has('ArrowLeft');
            d = this.pressed_keys.has('ArrowRight');
            space = this.pressed_keys.has('Enter');
        }

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

    update_direction() {
        let players = this.kof.players;
        if (players[0] && players[1]) {
            let me = this;
            let you = players[1 - this.id];
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