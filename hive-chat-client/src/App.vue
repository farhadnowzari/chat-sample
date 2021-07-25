<template>
  <v-app :style="$vuetify.breakpoint.lgAndUp ? 'background-color: #f4f4f4' : '#fff'">
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
@Component
export default class App extends Vue {

}
</script>
