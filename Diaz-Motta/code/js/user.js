export default class User {
    #name;
    #email;
    #password;

    constructor (name, email, password) {
        this.#name = name;
        this.#email = email;
        this.#password = password;
    }

    get name() {
        return this.#name;
    }

    get email() {
        return this.#email;
    }

    get password() {
        return this.#password;
    }
}