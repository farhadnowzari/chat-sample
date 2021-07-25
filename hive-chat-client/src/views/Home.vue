<template>
  <v-card 
    :flat="$vuetify.breakpoint.mdAndDown"
    :tile="$vuetify.breakpoint.mdAndDown"
    class="mw-narrow my-12 mx-auto">
    <div class="pt-12 px-12">
      <v-img :src="require('@/assets/welcome_cats.svg')"></v-img>
    </div>
    <v-card-text>
      <h2 class="text-h4 text-center my-6">Please fill in the form below :)</h2>
      <validation-observer v-slot="{ invalid }">
        <form @submit.prevent="joinRoom">
          <div class='mw-narrower mx-auto'>
            <div class="my-3">
              <validation-provider name="Room" rules="required" v-slot="{ errors }">
                <v-text-field 
                  :hide-details="errors.length === 0"
                  :error-messages="errors"
                  label="Room" 
                  large 
                  outlined
                  placeholder="The room name which you want to create or join"
                  v-model="room"></v-text-field>
              </validation-provider>
            </div>
            <div class="my-3">
              <validation-provider name="Name" rules="required|regex:^[a-zA-Z0-9 ]+$" v-slot="{ errors }">
                <v-text-field 
                  :hide-details="errors.length === 0"
                  :error-messages="errors"
                  large 
                  label="Name" 
                  outlined
                  placeholder="Your display name"
                  v-model="user"></v-text-field>
              </validation-provider>
            </div>
            <v-btn :disabled="invalid" type="submit" class="my-6" block color="primary" x-large>Join!</v-btn>
          </div>
        </form>
      </validation-observer>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { required, regex } from 'vee-validate/dist/rules';
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';

extend('required', {
  ...required,
  message: '{_field_} is required'
});
extend('regex', {
  ...regex,
  message: 'Special characters are not allowed for {_field_}'
})


@Component({
  components: {
    ValidationProvider,
    ValidationObserver
  }
})
export default class Home extends Vue {
  @Prop(String)
  readonly roomParam!: string;


  room: string | null = null;
  user: string | null = null;

  joinRoom(): void {
    this.$router.push({ name: 'room', params: { roomId: this.room as string, user: this.user as string } });
  }

  mounted(): void {
    if(this.roomParam) {
      this.room = this.roomParam;
    }
  }
}
</script>

<style lang="scss">
.mw-narrow {
  max-width: 500px !important;
}
.mw-narrower {
  max-width: 350px !important;
}
.w-100 {
  width: 100% !important;
}
.h-100 {
  height: 100% !important;
}
.vh-100 {
  height: 100vh !important;
}
</style>
