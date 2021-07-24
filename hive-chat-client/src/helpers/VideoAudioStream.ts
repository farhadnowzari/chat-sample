import RoomsController from "@/controllers/RoomsController";
import User from "@/models/User";
import UserMessage from "@/models/UserMessage";
import Peer from "peerjs";
import LiteEventListener from "./LiteEventListener";

export default class VideoAudioStream {

    peer!: Peer;
    roomId: string;

    user: User;
    partyUsers: UserMessage[] = [];

    private readonly _streamReady = new LiteEventListener<UserMessage>();
    private readonly _streamReceived = new LiteEventListener<UserMessage>();
    private readonly _connectionClosed = new LiteEventListener<UserMessage>();

    get streamReady(): LiteEventListener<UserMessage> { return this._streamReady }
    get streamReceived(): LiteEventListener<UserMessage> { return this._streamReceived }
    get connectionClosed(): LiteEventListener<UserMessage> { return this._connectionClosed }

    constructor(peer: Peer, roomId: string, userId: string) {
        this.peer = peer;
        this.roomId = roomId;
        this.user = new User(userId);
    }



    start() : void {
        navigator.mediaDevices
            .getUserMedia({
                video: true,
                audio: true
            })
            .then((stream) => {
                const userMessage = new UserMessage(this.user);
                userMessage.stream = stream;
                this._streamReady.trigger(userMessage);
                this.listenToCalls(stream);
                this.listenToNewJoiningUsers(stream);
            });
    }

    private listenToCalls(stream: MediaStream): void {
        this.peer.on('call', call => {
            const partyUser = new UserMessage(call.metadata as User);
            partyUser.call = call;
            call.answer(stream);
            call.on('stream', _stream => {
                partyUser.stream = _stream;
                this._streamReceived.trigger(partyUser);
            });
            call.on('close', () => {
                this._connectionClosed.trigger(partyUser);
            });
            this.partyUsers.push(partyUser);
        });
    }

    private listenToNewJoiningUsers(stream: MediaStream): void {
        const roomsController = new RoomsController(this.roomId, this.user.completeId);
        roomsController.userConnected.on(joinedUser => {
            if(!joinedUser) return;
            this.partyUsers.push(joinedUser);
            const call = this.peer.call(joinedUser.userId, stream, {
                metadata: this.user
            });
            call.on('stream', _stream => {
                joinedUser.stream = _stream;
                this._streamReceived.trigger(joinedUser);
            });
            call.on('error', (error) => {
                console.error(error);
            });
            call.on('close', () => {
                this._connectionClosed.trigger(joinedUser);
            });
            joinedUser.call = call;
        });
        roomsController.userDisconnected.on(disconnectedUser => {
            if(!disconnectedUser) return;
            const _user = this.partyUsers.find(x => x.userId === disconnectedUser.id);
            if(_user && _user.call) {
                _user.call.close();
                this._connectionClosed.trigger(_user);
                this.partyUsers = this.partyUsers.filter(x => x.userId !== disconnectedUser.id);
            }
        });
    }
}