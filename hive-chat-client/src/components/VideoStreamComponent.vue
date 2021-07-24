<template>
    <div>
        <video ref="videoRef" ></video>
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
    object-fit: cover;
}
</style>