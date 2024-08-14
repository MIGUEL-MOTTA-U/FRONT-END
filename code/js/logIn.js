$(() => {
    let viewModel = {
        sessionStarted: ko.observable(JSON.parse(localStorage.sessionStarted)),
        userFound: false,
        user: ko.observable(JSON.parse(localStorage.user)),
    
        logIn(obj) {
            const user = JSON.parse(localStorage.user);
            user.name = obj.name; 
            user.email = obj.email; 
            user.password = obj.password; 
            localStorage.user = JSON.stringify(user);
            this.user(user);
            this.sessionStarted(true);
        },
    
        logOut() {
            localStorage.user = JSON.stringify({});
            localStorage.sessionStarted = JSON.stringify(false);
            this.sessionStarted(false);
            this.userFound = false;
            this.user({});
        },
    
        searchUser(email, password) {
            this.userFound = false;
            let user = null;
            
            if (localStorage.users) {
                const users = JSON.parse(localStorage.users);
    
                for (let i = 0; i < users.length; i++) {
                    user = users[i];
    
                    if (user.email === email && user.password === password) {
                        this.userFound = true;
                        localStorage.sessionStarted = JSON.stringify(true);
                        break;
                    }
                }
            }
    
            return user;
        }
    };
    
    let controller = {
        init: () => {
            view.init();
        },
    
        userFound: () => viewModel.userFound,
    
        searchUser: (email, password) => viewModel.searchUser(email, password),
    
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
            viewModel.logIn(user);
        },
    
        logOut: () => {
            viewModel.logOut();
        }
    };
    
    let view = {
        init: () => {
            $('#form').on('submit', e => {
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
    
            $('#logOut-btn').on('click', () => {
                controller.logOut();
            }) 
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

    ko.applyBindings(viewModel);
    controller.init();
})
