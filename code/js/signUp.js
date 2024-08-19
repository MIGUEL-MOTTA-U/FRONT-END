import User from "./user.js";

$(() => {
    let model = {
        /**
         * Adds a new user to the localStorage users array
         * @param {object} user the user object to be added
         */
        addUser: user => {
            let data = JSON.parse(localStorage.users);
            data.push(user);            
            localStorage.users = JSON.stringify(data);
        },

        /**
         * Creates a new User object.
         * @param {string} name - The user's name.
         * @param {string} email - The user's email.
         * @param {string} password - The user's password.
         * @return {object} The created User object.
         */
        createUser: (name, email, password) =>  new User(name, email, password),

        expressions: {
            name: /^[a-zA-Z\s]+$/,
            email: /^[a-zA-Z\d\.\_\-]+@[a-zA-Z\d]+\.[a-zA-Z\d\.]{2,}$/,
            password: /^(?=.*[A-Z])(?=.*[\W_])(?=.*\d)[A-Za-z\d\W_]{4,16}$/
        },
    
        messages: {
            name: 'El nombre solo de tener letras.',
            email: 'El correo debe contar con un dominio valido.',
            password: 'La contraseña tiene que ser de 4 a 12 dígitos y debe contar con al menos: 1 mayuscula, 1 numero y 1 caracter especial.',
            password2: 'Las contraseñas deben ser iguales'
        },
    
        fields: {
            name: false,
            email: false,
            password: false,
            password2: false
        },

        /**
         * Checks if all form fields are correctly filled.
         * @return {boolean} True if all fields are valid, otherwise false.
         */
        correctFields() {
            return Object.values(this.fields).every(value => value === true);
        },
    
        /**
         * Validates a specific form field based on the input value.
         * @param {Event} e - The event object from the input field.
         */
        validate(e) {
            switch (e.target.name) {
                case 'name':
                    this.validateField(e.target, e.target.value, this.expressions.name, this.messages.name);
                    break;
                case 'email':
                    this.validateField(e.target, e.target.value, this.expressions.email, this.messages.email);
                    break;
                case 'password':
                    this.validateField(e.target, e.target.value, this.expressions.password, this.messages.password);
                    this.checkSamePassword();
                    break;
                case 'password2':
                    this.checkSamePassword();
                    break;
                default:
                    break;
            }
        },
    
        /**
         * Validates an individual field against the provided regular expression.
         * @param {HTMLElement} input - The input element to validate.
         * @param {string} value - The value of the input field.
         * @param {RegExp} expression - The regular expression to test the input value.
         * @param {string} message - The error message to display if validation fails.
         */
        validateField(input, value, expression, message) {
            if (value === '') {
                controller.removeCorrect(input);
                controller.removeError(input);
    
                this.fields[input.name] = false;
            } else if (expression.test(value)) {
                controller.removeError(input);
                controller.showCorrect(input);
    
                this.fields[input.name] = true;
            } else {
                controller.removeCorrect(input);
                controller.showError(input, message);
    
                this.fields[input.name] = false;
            }
        },
    
        /**
         * Checks if the password confirmation matches the original password.
         */
        checkSamePassword() {
            const passwords = controller.getPasswords();
            const password = passwords.password.val();
            const password2 = passwords.password2;
    
            if (password === '') {
                controller.removeCorrect(password2);
                controller.removeError(password2);

                this.fields.password2 = false;
            } else if (password === password2.val()) {
                controller.removeError(password2);
                controller.showCorrect(password2);
                
                this.fields.password2 = true;
            } else {
                controller.removeCorrect(password2);
                controller.showError(password2, this.messages.password2);
    
                this.fields.password2 = false;
            }
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
         * Validates a specific form field based on the input value.
         * @param {Event} e - The event object from the input field.
         */
        validateField: e => {
            model.validate(e);
        },

        /**
         * Displays the correct input styling.
         * @param {HTMLElement} input - The input element to style.
         */
        showCorrect: input => {
            correctInfoView.showCorrect(input);
        },

        /**
         * Displays an error message for an invalid input field.
         * @param {HTMLElement} input - The input element to style.
         * @param {string} msg - The error message to display.
         */
        showError: (input, msg) => {
            wrongInfoView.showError(input, msg);
        },

        /**
         * Removes correct input styling.
         * @param {HTMLElement} input - The input element to remove styling from.
         */
        removeCorrect: input => {
            correctInfoView.removeCorrect(input);
        },

        /**
         * Removes error message and styling.
         * @param {HTMLElement} input - The input element to remove styling from.
         */
        removeError: input => {
            wrongInfoView.removeError(input);
        },

        /**
         * Displays a success message after form submission.
         */
        submittedMessage: () => {
            correctInfoView.submittedMessage();
        },

        /**
         * Displays an error message if form submission fails.
         */
        failedMessage: () => {
            wrongInfoView.failedMessage();
        },

        /**
         * Removes any displayed message.
         */
        removeMessage: () => {
            view.removeMessage();
        },

        /**
         * Checks if all form fields are correctly filled.
         * @return {boolean} True if all fields are valid, otherwise false.
         */
        correctFields: () => model.correctFields(),

        /**
         * Retrieves the password fields from the form.
         * @return {Object} An object containing the password and password confirmation fields.
         */
        getPasswords: () => view.getPasswords(),

        /**
         * Creates a new User object.
         * @param {string} name - The user's name.
         * @param {string} email - The user's email.
         * @param {string} password - The user's password.
         * @return {object} The created User object.
         */
        createUser: (name, email, password) => model.createUser(name, email, password),

        /**
         * Adds a new user to the localStorage users array
         * @param {object} user the user object to be added
         */
        addUser: user => {
            model.addUser({
                name: user.name,
                email: user.email,
                password: user.password
            })
        }
    };

    let view = {
        /**
         * Initializes event listeners for form inputs and submission.
         */
        init: () => {
            const inputs = $('.form__input');
            const form = $('#form');

            inputs.each(function() {
                $(this).on('keyup', controller.validateField);
                $(this).on('blur', controller.validateField);
            });

            form.on('submit', e => {
                e.preventDefault();
                
                const correctFields = controller.correctFields();
        
                if (correctFields) {
                    controller.submittedMessage();
                                
                    controller.addUser(controller.createUser($('#name').val(), $('#email').val(), $('#password').val()));
        
                    setTimeout(() => {
                        controller.removeMessage();
                        window.location.assign('../html/logIn.html');
                    }, 2000);
        
                    view.resetAll();
                } else {
                    controller.failedMessage();
        
                    setTimeout(() => {
                        controller.removeMessage();
                    }, 5000);
                }
            });
        },

        /**
         * Removes any displayed message element from the DOM.
         */
        removeMessage: () => {
            $('.message').remove();
        },
    
        /**
         * Resets all form inputs and their styles.
         */
        resetAll: () => {
            const form = $('#form');
            const inputs = $('.form__input');

            form[0].reset();
    
            inputs.each(function() {
                $(this).attr('class', 'form__input')
            });
        },

        /**
         * Retrieves the password fields from the form.
         * @return {Object} An object containing the password and password confirmation fields.
         */
        getPasswords: () => {
            return {
                password: $('#password'),
                password2: $('#password2'),
            }
        }
    };

    let correctInfoView = {
        /**
         * Displays correct styling for a valid input.
         * @param {HTMLElement} input - The input element to style.
         */
        showCorrect: input => {
            $(input).addClass('form__input--correct');
        },
    
        /**
         * Removes correct input styling.
         * @param {HTMLElement} input - The input element to remove styling from.
         */
        removeCorrect: input => {
            $(input).removeClass('form__input--correct');
        },

        /**
         * Displays a success message after form submission.
         */
        submittedMessage: () => {
            const message = $('<div></div>').attr('class', 'message message--correct');
            const icon = $('<i></i>').attr('class', 'fa-solid fa-circle-check');
            const text = $('<p></p>').attr('class', 'message__text').text('Cuenta creada');
    
            message.append(icon).append(text);
            $('body').prepend(message);
        }
    };

    let wrongInfoView = {
        /**
         * Displays an error message for an invalid input field.
         * @param {HTMLElement} input - The input element to style.
         * @param {string} msg - The error message to display.
         */
        showError: (input, message) => {
            const element = $(input);
            const parent = element.parent();
            parent.next().remove();
            const text = $('<p></p>').attr('class', 'form__error').text(message);
            const icon = $('<i></i>').attr('class', 'fa-solid fa-circle-exclamation');
            
            text.prepend(icon);
            parent.after(text);
            element.addClass('form__input--error');
        },
        
        /**
         * Removes error message and styling.
         * @param {HTMLElement} input - The input element to remove styling from.
         */
        removeError: input => {
            const element = $(input);
    
            if (element.hasClass('form__input--error')) {
                const parent = element.parent();
    
                parent.next().remove();
                element.removeClass('form__input--error');
            }
        },
       
        /**
         * Displays an error message if form submission fails.
         */
        failedMessage: () => {
            const message = $('<div></div>').attr('class', 'message message--error');
            const icon = $('<i></i>').attr('class', 'fa-solid fa-circle-exclamation');
            const text = $('<p></p>').attr('class', 'message__text').text('Por favor llena todos los campos de manera correcta');
        
            message.append(icon).append(text);
            $('body').prepend(message);
        },
    };

    controller.init();
});