export class Login {
    constructor(kof) {
        this.kof = kof;
        this.$login = this.kof.$kof.find('.login');
        this.$username = this.$login.find('#login-username');
        this.$password = this.$login.find('#login-password');
        this.$message = this.$login.find('.error-message');
        this.$button = this.$login.find('#login-button');
        this.$switch = this.$login.find('#login-switch');

        this.start();
    }

    show() {
        this.$login.show();
    }

    hide() {
        this.$login.hide();
    }

    add_listening_events() {
        this.$switch.click(() => {
            this.hide();
            this.kof.register.show();
        });

        this.$button.click(() => {
            let username = this.$username.val();
            let password = this.$password.val();
            $.ajax({
                url: "http://106.15.0.62:8000/kof/login/",
                type: "GET",
                data: {
                    username: username,
                    password: password,
                },
                success: (resp) => {
                    if (resp.result === 'success') {
                        location.reload();
                    } else {
                        this.$message.text("wrong");
                    }
                },
            });
        });
    }

    start() {
        this.hide();
        this.add_listening_events();
    }
}