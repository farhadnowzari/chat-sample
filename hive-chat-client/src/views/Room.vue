<template>
    <div class="scrollable" style="background-color:#000; height: 100vh;">
        <v-overlay v-if="!connectionId" color="white" opacity="1" z-index="99">
            <v-container class="mx-auto mw-narrower d-flex flex-column align-center justify-center" fluid>
                <img :src="require('@/assets/happy_bird.svg')" class='w-100' />
                <div class="text-h6 black--text mt-12 text-center">
                    Please wait until we get things ready
                </div>
                <v-progress-linear class='mt-5' color="primary" indeterminate></v-progress-linear>
            </v-container>
        </v-overlay>
        <v-container v-if="partyUsers.length > 0">
            <v-row align="center" class='vh-100'>
                <v-col
                    :key="index"
                    cols="12"  xs="6" lg="5" xl="4"
                    v-for="(partyUser, index) in partyUsers">
                    <video-stream-component 
                        :fullscreen="partyUsers.length === 1"
                        :room="roomId"
                        :user="partyUser" 
                        class='align-self-center' 
                        show-name ></video-stream-component>
                </v-col>
            </v-row>
        </v-container>
        <v-container fluid class='w-100 h-100 d-flex flex-column' v-else>
            <div class="d-flex flex-column align-center justify-center mx-auto my-auto">
                <img :src="require('@/assets/alone.svg')" class='mx-auto my-auto' height="200">
                <span class="white--text mt-6 mw-narrower text-center">You are the only one in the room, please wait for other to join :)</span>
                <v-btn 
                    @click="copyTheRoomLinkToClipboard()" 
                    class="mt-2"
                    outlined 
                    color="primary">
                    <v-icon small>mdi-clipboard-edit-outline</v-icon>
                    <span class='ml-1'>Room's link</span>
                </v-btn>
            </div>
        </v-container>
        <video-stream-component 
            :user="hostUser"
            class="hover-avatar elevation-6"
            mute v-if="hostUser"></video-stream-component>
        <v-footer fixed style='z-index: 11; background-color: transparent;'>
            <div class="mx-auto d-flex align-center justify-center my-12 mw-narrow">
                <v-btn @click="copyTheRoomLinkToClipboard()" 
                    class="mr-6"
                    color='primary'
                    small 
                    fab
                    v-if="showFullChatOptions">
                    <v-icon small>mdi-clipboard-edit-outline</v-icon>
                </v-btn>
                <v-btn @click="hangup" color="primary" dark fab>
                    <v-icon>mdi-phone-hangup</v-icon>
                </v-btn>
                <v-btn @click="openChat()" 
                    class="ml-6"
                    color='primary'
                    small fab
                    v-if="showFullChatOptions">
                    <v-icon small>mdi-chat-processing-outline</v-icon>
                </v-btn>
            </div>
        </v-footer>
        <floating-message ref="floatingMessage"></floating-message>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import Peer from 'peerjs';
import VideoAudioStream from '@/helpers/VideoAudioStream';
import VideoStreamComponent from '@/components/VideoStreamComponent.vue';
import UserMessage from '@/models/UserMessage';
import ClipboardUtils from '@/utils/ClipboardUtils';
import FloatingMessage from '@/components/FloatingMessage.vue';

@Component({
    components: {
        VideoStreamComponent,
        FloatingMessage
    }
})
export default class Room extends Vue {
    $refs!: {
        floatingMessage: FloatingMessage
    }

    @Prop(String)
    readonly roomId!: string;
    @Prop(String)
    readonly user!: string;

    //when it is null, it means the peerjs connection is not made yet
    connectionId: string | null = null;
    peer!: Peer;
    hostUser: UserMessage | null = null;
    partyUsers: UserMessage[] = [];
    vas: VideoAudioStream | null = null;

    get roomLink(): string {
        const href = this.$router.resolve({ name: 'home' }).href;
        const origin = window.location.origin;
        return `${origin}/${href}${this.roomId}`;
    }

    get showFullChatOptions(): boolean {
        return this.partyUsers.length > 0;
    }

    hangup(): void {
        if(this.vas)
        {
            //Try to release my camera on hangup
            if(this.hostUser && this.hostUser.stream) {
                this.hostUser.stream.getTracks().forEach(x => {
                    x.stop();
                });
                this.hostUser.stream = null;
            }
            this.vas?.closeWebSocket();
            this.$router.push({ name: 'home' });
        }
    }

    copyTheRoomLinkToClipboard(): void {
        ClipboardUtils
            .saveToClipboard(this.roomLink)
            .then(() => {
                this.$refs.floatingMessage.show(`${this.roomLink} - Copied!`);
            });
    }

    openChat(): void {
        console.log('should open a chat!!!');
    }

    mounted(): void {
        this.peer = new Peer(undefined, {});
        this.peer.on('error', (err) => {
            console.log(err);
        })
        this.peer.on('open', (id) => {
            this.connectionId = `${this.user}|${id}`;
            const vas = new VideoAudioStream(this.peer, this.roomId, this.connectionId);
            vas.streamReady.on(myStream => {
                this.hostUser = myStream as UserMessage;
            });
            vas.streamReceived.on(partyUser => {
                if(!partyUser || !partyUser.stream) return;
                if(this.partyUsers.find(x => x.stream?.id === partyUser.stream?.id)) return;
                this.partyUsers.push(partyUser as UserMessage);
            });
            vas.connectionClosed.on(leftUser => {
                if(!leftUser) return;
                console.log('left user: ', leftUser);
                this.partyUsers = this.partyUsers.filter(x => x.userId != leftUser?.userId);
            })
            vas.start();  
            this.vas = vas;  
        });
    }
}
</script>

<style lang="scss" scoped>
.hover-avatar {
    position: fixed;
    width: 120px;
    height:150px;
    top: 2%;
    left: 1%;
    z-index: 10;
}
.scrollable {
    overflow: hidden;
    overflow-y: auto;
}
</style>
