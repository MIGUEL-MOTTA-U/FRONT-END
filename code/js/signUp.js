$(() => {
    let model = {
        expressions: {
            name: /^[a-zA-Z\s]+$/,
            email: /^[a-zA-Z\d\.\_\-]+@[a-zA-Z\d]+\.[a-zA-Z\d\.]{2,}$/,
            password: /^(?=.*[A-Z])(?=.*[\W_])(?=.*\d)[A-Za-z\d\W_]{8,16}$/
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

        correctFields() {
            return Object.values(this.fields).every(value => value === true);
        },
    
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
        init: () => {
            view.init();
        },

        validateField: e => {
            model.validate(e);
        },

        showCorrect: input => {
            correctInfoView.showCorrect(input);
        },

        showError: (input, msg) => {
            wrongInfoView.showError(input, msg);
        },

        removeCorrect: input => {
            correctInfoView.removeCorrect(input);
        },

        removeError: input => {
            wrongInfoView.removeError(input);
        },

        submittedMessage: () => {
            correctInfoView.submittedMessage();
        },

        failedMessage: () => {
            wrongInfoView.failedMessage();
        },

        removeMessage: () => {
            view.removeMessage();
        },

        correctFields: () => model.correctFields(),

        getPasswords: () => view.getPasswords()
    };

    let view = {
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
        
                    setTimeout(() => {
                        controller.removeMessage();
                    }, 5000);
        
                    view.resetAll();
                } else {
                    controller.failedMessage();
        
                    setTimeout(() => {
                        controller.removeMessage();
                    }, 5000);
                }
            });
        },

        removeMessage: () => {
            $('.message').remove();
        },
    
        resetAll: () => {
            const form = $('#form');
            const inputs = $('.form__input');

            form[0].reset();
    
            inputs.each(function() {
                $(this).attr('class', 'form__input')
            });
        },

        getPasswords: () => {
            return {
                password: $('#password'),
                password2: $('#password2'),
            }
        }
    };

    let correctInfoView = {
        showCorrect: input => {
            $(input).addClass('form__input--correct');
        },
    
        removeCorrect: input => {
            $(input).removeClass('form__input--correct');
        },

        submittedMessage: () => {
            const message = $('<div></div>').attr('class', 'message message--correct');
            const icon = $('<i></i>').attr('class', 'fa-solid fa-circle-check');
            const text = $('<p></p>').attr('class', 'message__text').text('Cuenta creada');
    
            message.append(icon).append(text);
            $('body').prepend(message);
        }
    };

    let wrongInfoView = {
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
        
        removeError: input => {
            const element = $(input);
    
            if (element.hasClass('form__input--error')) {
                const parent = element.parent();
    
                parent.next().remove();
                element.removeClass('form__input--error');
            }
        },
       
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