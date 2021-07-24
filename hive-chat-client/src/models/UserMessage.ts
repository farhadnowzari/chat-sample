import { MediaConnection } from "peerjs";
import User from "./User";

export default class UserMessage {
    constructor(user: string | User) {
        if(typeof user === 'string')
        {
            this.user = new User(user);
            return;
        }
        this.user = user as User;
        
                
    }
    user!: User;
    message: string | null = null;
    stream: MediaStream | null = null;
    call: MediaConnection | null = null;

    get userId(): string {
        return this.user.id;
    }
}