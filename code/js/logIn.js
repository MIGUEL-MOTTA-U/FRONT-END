$(() => {
    let model = {
        userFound: false,

        searchUser(email, password) {
            this.userFound = false;
            
            if (localStorage.users) {
                const users = JSON.parse(localStorage.users);

                for (let i = 0; i < users.length; i++) {
                    const user = users[i];

                    if (user.email === email && user.password === password) {
                        this.userFound = true;
                        break;
                    }
                }
            }
        }
    };

    let controller = {
        init: () => {
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
        }
    };

    let view = {
        init: () => {
            const form = $('#form');

            form.on('submit', e => {
                e.preventDefault();

                controller.searchUser($('#email').val(), $('#password').val());
                        
                if (controller.userFound()) {
                    controller.submittedMessage();                    
                                        
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