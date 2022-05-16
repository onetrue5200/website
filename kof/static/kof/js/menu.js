export class Menu {
    constructor(kof) {
        this.kof = kof;
        this.$menu = $(`
<div class="menu">
    <div class="menu-item menu-item-match">
        match
    </div>
    <div class="menu-item menu-item-logout">
        logout
    </div>
</div>
`);
        this.kof.$kof.append(this.$menu);

        this.$match_btn = this.$menu.find('.menu-item-match');
        this.$logout_btn = this.$menu.find('.menu-item-logout');

        this.start();
    }

    add_listening_events() {
        let outer = this;
        this.$match_btn.click(function () {
            outer.hide();
            outer.kof.map.show();
            let uuid = outer.kof.map.add_player();
            outer.kof.map.create_socket(uuid);
            outer.kof.map.game_socket.ws.onopen = function () {
                outer.kof.map.game_socket.state = true;
                outer.kof.map.game_socket.send_create_player();
            }
        });
        this.$logout_btn.click(function () {
            console.log("click logout");
        });
    }

    show() {  // show menu
        this.$menu.show();
    }

    hide() {  // hide menu
        this.$menu.hide();
    }

    start() {
        this.add_listening_events();
    }
}