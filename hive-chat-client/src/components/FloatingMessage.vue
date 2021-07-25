<template>
    <v-snackbar timeout="2000" top v-model="toggler">
        <v-icon class="mr-1" color="primary">mdi-information-outline</v-icon> <span class='primary--text'>{{text}}</span>
    </v-snackbar>
</template>

<script lang='ts'>
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class FloatingMessage extends Vue {
    toggler = false;
    text: string | null = null;

    show(message: string): void {
        this.toggler = false;
        this.text= message;
        this.$nextTick(() => {
          this.toggler = true;  
        });
    }
}
</script>