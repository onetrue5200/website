import { Object } from "./object.js";
import { Controler } from "./controler.js";

export class Map extends Object {
    constructor(kof) {
        super();

        this.kof = kof;

        this.$canvas = $('<canvas width="1280" height="720" tabindex=0></canvas>');
        this.$canvas.focus();  // tabindex=0 to focus the canvas(listen to key)
        this.ctx = this.$canvas[0].getContext('2d');

        this.kof.$kof.append(this.$canvas);

        // create a controler
        this.controler = new Controler(this.$canvas)
    }

    start() { }


    render() {
        // clear the map before drawing the new one
        this.ctx.clearRect(0, 0, this.$canvas.width(), this.$canvas.height());
        // draw the map
        //this.ctx.fillStyle = 'black';
        //this.ctx.fillRect(0, 0, this.$canvas.width(), this.$canvas.height());
    }

    update() {
        this.render();
    }
}