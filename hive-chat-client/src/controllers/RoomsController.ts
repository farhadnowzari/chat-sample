import LiteEventListener from "@/helpers/LiteEventListener";
import User from "@/models/User";
import UserMessage from "@/models/UserMessage";

export default class RoomsController {

    WS_SERVER_URL = process.env.VUE_APP_WS_SERVER;
    roomId!: string;
    userId!: string;
    ws: WebSocket;

    private _userConnected: LiteEventListener<UserMessage>;
    private _userDisconnected: LiteEventListener<User>;

    get userConnected(): LiteEventListener<UserMessage> { return this._userConnected; }
    get userDisconnected(): LiteEventListener<User> { return this._userDisconnected; }

    constructor(roomId: string, userId: string) {
        this.roomId = roomId;
        this.userId = userId;
        
        this._userConnected = new LiteEventListener<UserMessage>();
        this._userDisconnected = new LiteEventListener<User>();

        this.ws = new WebSocket(`${this.WS_SERVER_URL}/${roomId}/${encodeURIComponent(userId)}`);
        this.ws.onmessage = (event) => {
            const data = event.data as string;
            const dataParts = data.split(':');
            const eventName = dataParts[0];
            if(eventName === 'user-connected') {
                const joinedUser = new UserMessage(dataParts[1]);
                this._userConnected.trigger(joinedUser);
                return;
            }
            if(eventName === 'user-disconnected') {
                const disconnectedUser = new User(dataParts[1]);
                this._userDisconnected.trigger(disconnectedUser);
                return;
            }
        };
    }
}

