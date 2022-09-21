export class Register {
    constructor(kof) {
        this.kof = kof;
        this.$register = this.kof.$kof.find('.register');
        this.$username = this.$register.find('#register-username');
        this.$password1 = this.$register.find('#register-password1');
        this.$password2 = this.$register.find('#register-password2');
        this.$message = this.$register.find('.error-message');
        this.$button = this.$register.find('#register-button');
        this.$switch = this.$register.find('#register-switch');

        this.start();
    }

    show() {
        this.$register.show();
    }

    hide() {
        this.$register.hide();
    }

    add_listening_events() {
        this.$switch.click(() => {
            this.hide();
            this.kof.login.show();
        });

        this.$button.click(() => {
            let username = this.$username.val();
            let password1 = this.$password1.val();
            let password2 = this.$password2.val();
            $.ajax({
                url: "http://onetrue.top/kof/register/",
                type: "GET",
                xhrFields: { withCredentials: true },
                crossDomain: true,
                data: {
                    username: username,
                    password1: password1,
                    password2: password2,
                },
                success: (resp) => {
                    if (resp.result === 'success') {
                        location.reload();
                    } else {
                        this.$message.text(resp.message);
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