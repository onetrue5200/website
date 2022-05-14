import { Player } from "../player.js";
import { GIF } from "../gif.js";

export class Kyo extends Player {
    constructor(root, info) {
        super(root, info);

        this.init_animations();
    }

    init_animations() {
        let outer = this;
        let frame_rates = [5, 5, 5, 3, 5, 5, 5];
        let offsets = [0, -22, -22, -140, 0, 0, 0];
        for (let i = 0; i < 7; i++) {
            let gif = GIF();
            gif.load(`/static/kof/image/player/kyo/${i}.gif`);
            this.animations.set(i, {
                gif: gif,
                frame_cnt: 0,
                frame_rate: frame_rates[i],
                offset_y: offsets[i],
                scale: 2,
                loaded: false,
            });
            gif.onload = function () {
                let animation = outer.animations.get(i);
                animation.frame_cnt = gif.frames.length;
                animation.loaded = true;
            }
        }
    }
}