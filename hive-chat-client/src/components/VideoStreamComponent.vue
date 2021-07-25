<template>
    <div :class="{fullscreen: fullscreen, 'position-relative': !fullscreen}">
        <video ref="videoRef"></video>
        <v-chip class="position-top-left d-flex align-center" v-if="showName">
            <v-icon class="mr-1" color="primary">mdi-account</v-icon>
            {{ user.user.name }}
        </v-chip>
    </div>
</template>

<script lang="ts">
import UserMessage from '@/models/UserMessage';
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class VideoStreamComponent extends Vue {
    $refs!: {
        videoRef: HTMLVideoElement
    }

    @Prop(Object)
    readonly user!: UserMessage;
    @Prop(Boolean)
    readonly mute!: boolean;
    @Prop(Boolean)
    readonly mirror!: boolean;
    @Prop(Boolean)
    readonly fullscreen!: boolean;
    @Prop(Boolean)
    readonly showName!: boolean;

    mounted(): void {
        this.$nextTick(() => {
            this.$refs.videoRef.autoplay = true;
            this.$refs.videoRef.muted = this.mute;
            this.$refs.videoRef.volume = 1;
            this.$refs.videoRef.srcObject = this.user.stream;
        })
    }
}
</script>
<style scoped>
video {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.fullscreen {
    position:fixed;
    top:0;
    left: 0;
    z-index: 9;
    width: 100%;
    height: 100%;
}
.position-top-left {
    position: absolute;
    top: 2%;
    right: 2%;
}
.position-relative {
    position: relative;
}
</style>
