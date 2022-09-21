import { Menu } from "./menu.js";
import { Map } from "./map.js";
import { Login } from "./login.js";
import { Register } from "./register.js";

// the kof game class
export class KOF {
    constructor(id) {
        this.$kof = $('#' + id);  // the div
        // crate a login
        this.login = new Login(this);
        // create a register
        this.register = new Register(this);
        // create a menu
        this.menu = new Menu(this);
        // create a map
        this.map = new Map(this);

        this.start();
    }

    getinfo() {
        let outer = this;
        $.ajax({
            url: 'http://onetrue.top/kof/getinfo/',
            type: 'GET',
            xhrFields: { withCredentials: true },
            crossDomain: true,
            data: {},
            success: function (resp) {
                if (resp.result === 'success') {
                    outer.menu.show();
                } else {
                    outer.login.show();
                }
            }
        });
    }

    start() {
        this.getinfo();
    }
}