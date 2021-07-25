import User from "./User";

export default class ChatMessege {
    self = false;
    user!: User;
    message!: string;

    constructor(user: User, message: string) {
        this.user = user;
        this.message = message;
    }

    markAsSelf(): ChatMessege {
        this.self = true;
        return this;
    }
}