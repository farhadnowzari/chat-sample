import LiteEventListener from "@/helpers/LiteEventListener";
import ChatMessege from "@/models/ChatMessage";
import User from "@/models/User";
import UserMessage from "@/models/UserMessage";

export default class RoomsController {

    WS_SERVER_URL = process.env.VUE_APP_WS_SERVER;
    roomId!: string;
    userId!: string;
    ws: WebSocket;

    private _userConnected: LiteEventListener<UserMessage>;
    private _userDisconnected: LiteEventListener<User>;
    private _textMessageReceived: LiteEventListener<ChatMessege>;

    get userConnected(): LiteEventListener<UserMessage> { return this._userConnected; }
    get userDisconnected(): LiteEventListener<User> { return this._userDisconnected; }
    get textMessageReceived(): LiteEventListener<ChatMessege> { return this._textMessageReceived; }

    constructor(roomId: string, userId: string) {
        this.roomId = roomId;
        this.userId = userId;
        
        this._userConnected = new LiteEventListener<UserMessage>();
        this._userDisconnected = new LiteEventListener<User>();
        this._textMessageReceived = new LiteEventListener<ChatMessege>();

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
            //If none of the above if the case, it is a chat message
            const user = new User(dataParts[0]);
            const message = dataParts[1];
            this.textMessageReceived.trigger(new ChatMessege(user, message));
        };
    }
}

