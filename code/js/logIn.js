$(() => {
    let viewModel = {
        sessionStarted: ko.observable(JSON.parse(localStorage.sessionStarted)),
        userFound: false,
        user: ko.observable(JSON.parse(localStorage.user)),
    
        /**
         * Logs in the user and updates the user in the localStorage
         * @param {object} obj object contain the user information
         */
        logIn(obj) {
            const user = JSON.parse(localStorage.user);
            user.name = obj.name; 
            user.email = obj.email; 
            user.password = obj.password; 
            localStorage.user = JSON.stringify(user);
            this.user(user);
            this.sessionStarted(true);
        },
    
        /**
         * Logs out the user, clears the user data from localStorage, and updates the session state.
         */
        logOut() {
            localStorage.user = JSON.stringify({});
            localStorage.sessionStarted = JSON.stringify(false);
            this.sessionStarted(false);
            this.userFound = false;
            this.user({});
        },
    
        /**
         * Searches for a user in the stored users list based on email and password.
         * @param {string} email the user's email to search for
         * @param {string} password te user's password to search for
         * @returns {object|null} the user object if found, otherwise null
         */
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
        /**
         * Initializes the view.
         */
        init: () => {
            view.init();
        },
        
        /**
         * Returns whether a user was found.
         * @returns {true|false} tru if user was found, otherwise false
         */
        userFound: () => viewModel.userFound,
        
        /**
         * Searches for a user in the stored users list based on email and password.
         * @param {string} email the user's email to search for
         * @param {string} password te user's password to search for
         * @returns {object|null} the user object if found, otherwise null
         */
        searchUser: (email, password) => viewModel.searchUser(email, password),
        
        /**
         * Displays the message for a successful submission.
         */
        submittedMessage: () => {
            userFoundView.submittedMessage();
        },
        
        /**
         * Displays the message for a failed submission.
         */
        failedMessage: () => {
            userNotFound.failedMessage();
        },
        
        /**
         * Removes any displayed message.
         */
        removeMessage: () => {
            view.removeMessage();
        },
        
        /**
         * Logs in the user and updates the user in the localStorage
         * @param {object} obj object contain the user information
         */
        logIn: (user) => {
            viewModel.logIn(user);
        },
        
        /**
         * Logs out the user, clears the user data from localStorage, and updates the session state.
         */
        logOut: () => {
            viewModel.logOut();
        }
    };
    
    let view = {
        /**
         * Initializes event listeners for form submission and logout button.
         */
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
    
        /**
         * Removes any message element from the DOM.
         */
        removeMessage: () => {
            $('.message').remove();
        },
    };
    
    let userFoundView = {
        /**
         * Creates and displays a success message element.
         */
        submittedMessage: () => {
            const message = $('<div></div>').attr('class', 'message message--correct');
            const icon = $('<i></i>').attr('class', 'fa-solid fa-circle-check');
            const text = $('<p></p>').attr('class', 'message__text').text('Inicio de sesion exitoso');
    
            message.append(icon).append(text);
            $('body').prepend(message);
        }
    };
    
    let userNotFound = {
        /**
         * Creates and displays an error message element.
         */
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
