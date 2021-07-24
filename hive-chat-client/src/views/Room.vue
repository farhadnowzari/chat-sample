<template>
    <v-container>
        <v-overlay v-if="!userId" color="white" opacity="1">
            <v-container class="mx-auto mw-narrower d-flex flex-column align-center justify-center" fluid>
                <img :src="require('@/assets/happy_bird.svg')" class='w-100' />
                <div class="text-h6 black--text mt-12 text-center">
                    Please wait until we get things ready
                </div>
                <v-progress-linear class='mt-5' color="primary" indeterminate></v-progress-linear>
            </v-container>
        </v-overlay>
        <v-row>
            <v-col 
                :key="index"
                cols="12" md="6" lg="4" xl="3"
                v-for="(partyUser, index) in partyUsers">
                <video-stream-component :user="partyUser"></video-stream-component>
            </v-col>
        </v-row>
    </v-container>
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
    userId: string | null = null;
    peer!: Peer;
    roomsController!: RoomsController;
    myStream!: UserMessage;
    partyUsers: UserMessage[] = [];

    mounted(): void {
        this.peer = new Peer(undefined, {});
        this.peer.on('error', (err) => {
            console.log(err);
        })
        this.peer.on('open', (id) => {
            this.userId = `${this.user}|${id}`;
            const vas = new VideoAudioStream(this.peer, this.roomId, this.userId);
            vas.streamReady.on(myStream => {
                this.myStream = myStream as UserMessage;
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
        });
    }
}
</script>