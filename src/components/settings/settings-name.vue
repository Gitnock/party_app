<template>
  <div class="settings-name-main">
    <div class="content-main">
      <div class="content-container">
        <div class="content-text">
          <h1 class="content-title roboto-medium">Username</h1>
          <h3 class="content-subtitle roboto-medium">
            Your username is always public
          </h3>
        </div>
        <input
          type="text"
          class="content-input"
          :placeholder="getProfile.username"
          @input="isChanged"
          v-model="uname"
        />
      </div>
      <div class="content-container">
        <div class="content-text">
          <h1 class="content-title roboto-medium">Avatar</h1>
          <h3 class="content-subtitle roboto-medium">
            Try to be appropriate🤘
          </h3>
        </div>

        <div class="content-avatar-bg">
          <vs-avatar for="upload" size="132" circle color="#224168">
            <i class='bx bx-plus' style='color:#0291f4'  v-if="!getProfile.avatar"></i>
            <img
              v-bind:src="`${getProfile.avatar}`"
              v-if="getProfile.avatar"
              alt="profile image"
              draggable="false"
            />
            <input
              ref="FileInput"
              class="upload-input clickable"
              type="file"
              accept="image/png, image/jpeg, image/gif, image/jpg"
              @change="setImage"
            />
          </vs-avatar>
        </div>
      </div>
      <div class="content-container" v-if="isActive">
        <button class="content-save roboto-medium" @click="updateInfo">
          save
        </button>
      </div>
    </div>

    <vs-dialog not-close v-model="isEdit" ref="editImage">
      <div class="editImage-main">
        <div class="editImage-top">
          <div class="close-top-right" v-if="!isLoading">
            <vs-avatar circle color="#2B2E43" @click="isEdit = !isEdit" >
              <i class="bx bx-x" style="color:#ffffff"></i>
            </vs-avatar>
          </div>
        </div>
        <div class="editImage-content">
          <div>
            <div class="editImage-cropper">
              <vue-cropper
                ref="cropper"
                :fixedNumber="option.fixedNumber"
                :img="imgSrc"
                :info="option.info"
                :autoCrop="option.autoCrop"
                :autoCropWidth="option.autoCropWidth"
                :autoCropHeight="option.autoCropHeight"
                :fixedBox="option.fixedBox"
                :fixed="option.fixed"
              />
            </div>
            <button
              ref="button"
              class="editImage-upload roboto-medium"
              @click="uploadImage"
            >
              upload
            </button>
          </div>
        </div>
      </div>
    </vs-dialog>
  </div>
</template>

<script>
import { VueCropper } from 'vue-cropper';

import { mapGetters } from 'vuex';
import { storage, usersCollection } from '../../firebaseConfig';

export default {
  name: 'settings-name-page',
  components: {
    VueCropper,
  },
  data() {
    return {
      uname: '',
      isActive: false,
      isEdit: false,
      imgSrc: '',
      isLoading: false,
      option: {
        autoCrop: true,
        autoCropWidth: 200,
        autoCropHeight: 200,
        fixedNumber: [1, 1],
        fixed: true,
        info: false,

      },
    };
  },
  methods: {
    savesettings() {},
    isChanged() {
      if (this.uname.length > 1) {
        this.isActive = true;
      } else {
        this.isActive = false;
      }
    },
    // eslint-disable-next-line consistent-return
    setImage(e) {
      this.isEdit = true;
      const file = e.target.files[0];

      if (!/\.(jpg|jpeg|png|bmp|JPG|PNG)$/.test(e.target.value)) {
        this.openNotification('failed', 'jpeg,jpg,png,bmp', 'danger');
        this.isEdit = !this.isEdit;
        return false;
      }

      if (typeof FileReader === 'function') {
        const reader = new FileReader();
        reader.onload = (event) => {
          this.imgSrc = event.target.result;
          // rebuild cropperjs with the updated source
          this.$refs.cropper.refresh();
        };
        reader.readAsDataURL(file);
      } else {
        this.openNotification('failed', 'Sorry, FileReader API not supported', 'danger');
      }

      // reset file input
      e.target.value = '';
    },
    uploadImage() {
      this.$refs.cropper.getCropBlob((blob) => {
        const storageRef = storage.ref();
        const fileDest = `users/avatars/${this.getUser.uid}`;

        const metadata = {
          contentType: blob.type,
          cacheControl: 'public,max-age=300',
        };
        this.openLoadingCropper();
        const task = storageRef.child(fileDest).put(blob, metadata);
        task
          .then((snapshot) => snapshot.ref.getDownloadURL())
          .then((url) => {
            usersCollection
              .doc(this.getUser.uid)
              .update({
                avatar: url,
              })
              .then({});
            this.openNotification('Success', 'Avater was uploaded', 'success');
            this.isEdit = !this.isEdit;
          })
          .catch(console.error);
      });
    },
    openNotification(title, text, color) {
      this.$vs.notification({
        // flat: true,
        title,
        text,
        position: 'bottom-center',
        color,
      });
    },
    updateInfo() {
      usersCollection
        .doc(this.getUser.uid)
        .update({
          username: this.uname,
        })
        .then(() => {
          this.openNotification('Success', 'username was updated', 'success');
          this.uname = '';
          this.isActive = false;
        });
    },
    openLoadingCropper() {
      const loading = this.$vs.loading({
        target: this.$refs.editImage,
        scale: '0.6',
        background: 'primary',
        opacity: 1,
        color: '#fff',
      });
      this.isLoading = true;
      setTimeout(() => {
        loading.close();
        this.isLoading = false;
      }, 3000);
    },
  },
  computed: {
    ...mapGetters(['getProfile', 'getUser']),
  },
  mounted() {

  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/settings.scss';

</style>
