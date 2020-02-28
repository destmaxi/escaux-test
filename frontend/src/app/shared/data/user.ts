export class User {
    constructor(private id: string, private token: string, private username: string) {
    }

    getID() {
        return this.id;
    }

    getToken() {
        return this.token
    }
}
