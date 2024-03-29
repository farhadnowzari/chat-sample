<template>
    <v-navigation-drawer 
        app 
        floating 
        overlay-opacity=".8" 
        right 
        temporary
        style="z-index: 100; max-width: 400px; width: 100%; height: 100% !important"
        v-model="toggler">
        <div class="d-flex align-start justify-start flex-column w-100 h-100">
            <v-toolbar class='w-100' elevation="1" tile absolute>
                <v-toolbar-title>
                    <v-icon color="primary" large>mdi-chat-processing-outline</v-icon> 
                    <span class='grey--text text--darken-2 text-h6 ml-2'>Chat</span>
                </v-toolbar-title>
                <v-btn @click="toggler = false" class="ml-auto" icon>
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <div
                :class="{ 'd-flex': messages.length > 0, 'd-none': messages.length === 0 }" 
                class="h-100 w-100 scrollable flex-column" style="margin-top: 64px; margin-bottom: 56px;" ref='messagesHolder'>
                <div class="mt-auto" v-if="messages.length > 0">
                    <div :key="index" class="pa-2" v-for="(message, index) in messages">
                        <div>
                            <p class='ma-0 pa-0'>
                                <span>
                                    <v-icon :color="message.self ? 'grey' : 'primary'">mdi-account</v-icon>
                                    <strong v-if="!message.self">{{ message.user.name }}:</strong>
                                    <strong v-else>You:</strong>
                                </span>
                                {{message.message}}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="d-flex align-center justify-center w-100 h-100" v-if="messages.length === 0">
                <img :src="require('@/assets/chatting.svg')" height="200" />
            </div>
            <v-footer tile fixed class="mt-auto w-100 pa-0" bottom>
                <v-text-field 
                    @keypress.enter="sendMessage()"
                    filled
                    clearable
                    placeholder="Message..." 
                    hide-details
                    v-model="chatMessage" ></v-text-field>
            </v-footer>
        </div>
    </v-navigation-drawer>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import ChatMessage from '@/models/ChatMessage';
import VideoAudioStream from '@/helpers/VideoAudioStream';

@Component
export default class ChatPanel extends Vue {
    $refs!: {
        messagesHolder: HTMLElement
    }

    @Watch('vas')
    onVasChanged(newValue : VideoAudioStream, oldValue : VideoAudioStream | null): void {
        if(oldValue) return;
         this.vas.chatMessageReceived.on(chatMessage => {
            if(!chatMessage) return;
            this.messages.push(chatMessage);
            this.$nextTick(() => {
                this.$refs.messagesHolder.scrollTop = this.$refs.messagesHolder.scrollHeight;
            });
        });
    }
    @Prop(Object)
    readonly vas!: VideoAudioStream;

    chatMessage: string | null = null;
    messages: ChatMessage[] = [];
    toggler = false;

    sendMessage(): void {
        if(!this.chatMessage) return;
        var result = this.vas.sendTextMessage(this.chatMessage);
        const myMessage = new ChatMessage(this.vas.user, this.chatMessage).markAsSelf();
        this.messages.push(myMessage);
        this.$nextTick(() => {
            this.$refs.messagesHolder.scrollTop = this.$refs.messagesHolder.scrollHeight;
        });
        if (result) this.chatMessage = null;
    }

    show(): void {
        this.toggler = true;
    }
}
</script>
<style lang="scss" scoped>
.scrollable {
    overflow: hidden;
    overflow-y: auto;
}
</style>