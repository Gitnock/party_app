<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <ValidationObserver v-slot="{ handleSubmit }">
            <form @submit.prevent="handleSubmit(save)">
              <div class="modal-body">
                <ValidationProvider
                  name="username"
                  rules="required"
                  v-slot="{ errors }"
                  class="full-width"
                >
                  <div class="uname-content-container">
                    <div class="content-text">
                      <h1 class="content-title roboto-medium">Add username</h1>
                      <h3 class="content-subtitle roboto-medium">
                        Add In game username
                      </h3>
                    </div>
                    <b-field
                      class="field"
                      type="is-danger"
                      :message="errors[0]"
                    >
                      <input
                        type="text"
                        v-model="username"
                        class="content-input"
                        placeholder="Username#0000"
                      />
                    </b-field>
                  </div>
                </ValidationProvider>
              </div>

              <div class="modal-footer" v-if="canSub">
                <button
                  class="
                    modal-accept-button modal-button
                    roboto-medium
                    btn-drop
                  "
                  ref="accept-btn"
                  type="submit"
                >
                  Save
                </button>
                <button
                type="button"
                  class="modal-leave-button modal-button roboto-medium btn-drop"
                  @click="$emit('close')"
                >
                  Cancel
                </button>
              </div>
            </form>
          </ValidationObserver>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { ValidationProvider, extend } from 'vee-validate';
import { required } from 'vee-validate/dist/rules';
import { usersCollection } from '../../firebaseConfig';

extend('required', {
  ...required,
  message: 'This field is required',
});

export default {
  data: () => ({
    canSub: true,
    username: '',
  }),
  components: {
    ValidationProvider,
  },
  methods: {
    ...mapActions(['favGameAction']),
    async save() {
      if (this.canSub) {
        console.log('save');
        this.canSub = false;
        await usersCollection.doc(this.getUser.uid).collection('favGames').doc(this.getGame.gameId).set({
          uname: this.username,
          gameId: this.getGame.gameId,
        });
        this.$emit('close');
        this.favGameAction(this.getUser.uid);
      }
    },
  },
  computed: {
    ...mapGetters(['getGame', 'getUser']),
  },
};
</script>

<style lang="scss">
@import '@/assets/styles/modal.scss';
@import '@/assets/styles/settings.scss';
.uname-content-container {
  width: 100%;
}
.full-width {
  width: 100%;
}
</style>
