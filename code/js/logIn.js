$(() => {
    let model = {
        userFound: false,

        init: () => {
            if (!localStorage.user) {
                localStorage.user = JSON.stringify({});
            }
        },

        logIn: (obj) => {
            const user = JSON.parse(localStorage.user);
            user.name = obj.name; 
            user.email = obj.email; 
            user.password = obj.password; 
            localStorage.user = JSON.stringify(user);
        },

        logOut: () => {
            localStorage.user = JSON.stringify({});
        },

        searchUser(email, password) {
            this.userFound = false;
            let user = null
            
            if (localStorage.users) {
                const users = JSON.parse(localStorage.users);

                for (let i = 0; i < users.length; i++) {
                    user = users[i];

                    if (user.email === email && user.password === password) {
                        this.userFound = true;
                        break;
                    }
                }
            }

            return user;
        }
    };

    let controller = {
        init: () => {
            model.init();
            view.init();
        },

        userFound: () => model.userFound,

        searchUser: (email, password) => model.searchUser(email, password),

        submittedMessage: () => {
            userFoundView.submittedMessage();
        },

        failedMessage: () => {
            userNotFound.failedMessage();
        },

        removeMessage: () => {
            view.removeMessage();
        },

        logIn: (user) => {
            model.logIn(user);
        }
    };

    let view = {
        init: () => {
            const form = $('#form');

            form.on('submit', e => {
                e.preventDefault();

                const user = controller.searchUser($('#email').val(), $('#password').val());
                        
                if (controller.userFound()) {
                    controller.submittedMessage();      
                    controller.logIn(user);
                                        
                    setTimeout(() => {
                        controller.removeMessage();
                        window.location.assign('../html/index.html');
                    }, 2000);        
                } else {
                    controller.failedMessage();
                    console.log('no');
        
                    setTimeout(() => {
                        controller.removeMessage();
                    }, 5000);
                }
            });
        },

        removeMessage: () => {
            $('.message').remove();
        },
    };

    let userFoundView = {
        submittedMessage: () => {
            const message = $('<div></div>').attr('class', 'message message--correct');
            const icon = $('<i></i>').attr('class', 'fa-solid fa-circle-check');
            const text = $('<p></p>').attr('class', 'message__text').text('Inicio de sesion exitoso');
    
            message.append(icon).append(text);
            $('body').prepend(message);
        }
    };

    let userNotFound = {
        failedMessage: () => {
            const message = $('<div></div>').attr('class', 'message message--error');
            const icon = $('<i></i>').attr('class', 'fa-solid fa-circle-exclamation');
            const text = $('<p></p>').attr('class', 'message__text').text('Usuario no encontrado');
        
            message.append(icon).append(text);
            $('body').prepend(message);
        },
    }

    controller.init();
})