import { Menu } from "./menu.js";
import { Map } from "./map.js";

// the kof game class
export class KOF {
    constructor(id) {
        this.$kof = $('#' + id);  // the div
        // create a menu
        this.menu = new Menu(this);
        // create a map
        this.map = new Map(this);
    }
}