$(() => {
    const form = $('#form');
    const inputs = $('.form__input');

    const expressions = {
        name: /^[a-zA-Z\s]+$/,
        email: /^[a-zA-Z\d\.\_\-]+@[a-zA-Z\d]+\.[a-zA-Z\d\.]{2,}$/,
        password: /^(?=.*[A-Z])(?=.*[\W_])(?=.*\d)[A-Za-z\d\W_]{8,16}$/
    };

    const messages = {
        name: 'El nombre solo de tener letras.',
        email: 'El correo debe contar con un dominio valido.',
        password: 'La contraseña tiene que ser de 4 a 12 dígitos y debe contar con al menos: 1 mayuscula, 1 numero y 1 caracter especial.',
        password2: 'Las contraseñas deben ser iguales'
    };

    const fields = {
        name: false,
        email: false,
        password: false,
        password2: false
    }

    const validate = e => {
        switch (e.target.name) {
            case 'name':
                validateField(e.target, e.target.value, expressions.name, messages.name);
                break;
            case 'email':
                validateField(e.target, e.target.value, expressions.email, messages.email);
                break;
            case 'password':
                const password2 = $('#password2');
                validateField(e.target, e.target.value, expressions.password, messages.password);
                checkSamePassword();
                break;
            case 'password2':
                checkSamePassword();
                break;
            default:
                break;
        }
    };

    const validateField = (input, value, expression, message) => {
        if (value === '') {
            removeCorrect(input);
            removeError(input);

            fields[input.name] = false;
        } else if (expression.test(value)) {
            removeError(input);
            showCorrect(input);

            fields[input.name] = true;
        } else {
            removeCorrect(input);
            showError(input, message);

            fields[input.name] = false;
        }
    };

    const checkSamePassword = () => {
        const password = $('#password').val();
        const password2 = $('#password2');

        if (password === '') {
            removeCorrect(password2);
            removeError(password2);

            fields.password2 = false;
        } else if (password === password2.val()) {
            removeError(password2);
            showCorrect(password2);
            
            fields.password2 = true;
        } else {
            removeCorrect(password2);
            showError(password2, messages.password2);

            fields.password2 = false;
        }
    };

    const showError = (input, message) => {
        const element = $(input);
        const parent = element.parent();
        parent.next().remove();
        const text = $('<p></p>').attr('class', 'form__error').text(message);
        const icon = $('<i></i>').attr('class', 'fa-solid fa-circle-exclamation');
        
        text.prepend(icon);
        parent.after(text);
        element.addClass('form__input--error');
    };
    
    const removeError = input => {
        const element = $(input);

        if (element.hasClass('form__input--error')) {
            const parent = element.parent();

            parent.next().remove();
            element.removeClass('form__input--error');
        }
    };

    const showCorrect = input => {
        $(input).addClass('form__input--correct');
    };

    const removeCorrect = input => {
        $(input).removeClass('form__input--correct');
    };

    const submittedMessage = () => {
        const message = $('<div></div>').attr('class', 'message message--correct');
        const icon = $('<i></i>').attr('class', 'fa-solid fa-circle-check');
        const text = $('<p></p>').attr('class', 'message__text').text('Cuenta creada');

        message.append(icon).append(text);
        $('body').prepend(message);
    };
    
    const failedMessage = () => {
        const message = $('<div></div>').attr('class', 'message message--error');
        const icon = $('<i></i>').attr('class', 'fa-solid fa-circle-exclamation');
        const text = $('<p></p>').attr('class', 'message__text').text('Por favor llena todos los campos de manera correcta');
    
        message.append(icon).append(text);
        $('body').prepend(message);
    };

    const removeMessage = () => {
        $('.message').remove();
    }

    const resetAll = () => {
        form[0].reset();

        inputs.each(function() {
            $(this).attr('class', 'form__input')
        });
    };

    inputs.each(function() {
        $(this).on('keyup', validate);
        $(this).on('blur', validate);
    });

    form.on('submit', e => {
        e.preventDefault();
        
        const correctFields = Object.values(fields).every(value => value === true);

        if (correctFields) {
            submittedMessage();

            setTimeout(() => {
                removeMessage();
            }, 5000);

            resetAll();
        } else {
            failedMessage();

            setTimeout(() => {
                removeMessage();
            }, 5000);
        }
    });
});