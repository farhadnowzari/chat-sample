<template>
    <div class="scrollable" style="background-color:#000; height: 100%;">
        <v-overlay v-if="!connectionId" color="white" opacity="1">
            <v-container class="mx-auto mw-narrower d-flex flex-column align-center justify-center" fluid>
                <img :src="require('@/assets/happy_bird.svg')" class='w-100' />
                <div class="text-h6 black--text mt-12 text-center">
                    Please wait until we get things ready
                </div>
                <v-progress-linear class='mt-5' color="primary" indeterminate></v-progress-linear>
            </v-container>
        </v-overlay>
        <v-row align="center h-100">
            <v-col
                :key="index"
                cols="12" md="5"
                v-for="(partyUser, index) in partyUsers">
                <video-stream-component class='align-self-center' show-name :user="partyUser" :fullscreen="partyUsers.length === 1"></video-stream-component>
            </v-col>
        </v-row>
        <video-stream-component 
            :user="hostUser"
            class="hover-avatar elevation-6"
            mute v-if="hostUser"></video-stream-component>
        <v-footer fixed bottom style='z-index: 11; background-color: transparent'>
            <div class="mx-auto d-flex align-center my-12">
                <v-btn @click="hangup" color="primary" dark fab>
                    <v-icon>mdi-phone-hangup</v-icon>
                </v-btn>
            </div>
        </v-footer>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import Peer from 'peerjs';
import RoomsController from '@/controllers/RoomsController';
import VideoAudioStream from '@/helpers/VideoAudioStream';
import VideoStreamComponent from '@/components/VideoStreamComponent.vue';
import UserMessage from '@/models/UserMessage';

@Component({
    components: {
        VideoStreamComponent
    }
})
export default class Room extends Vue {
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

    hangup() {
        if(this.peer)
        {
            this.peer.disconnect();
            this.peer.destroy();
            this.$router.push({ name: 'home' });
        }
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
    width: 150px;
    height:100px;
    top: 2%;
    right: 2%;
    z-index: 10;
}
</style>
