import { statusCollection } from './firebaseConfig';

const warningMixin = {
  methods: {
    openNotification(title, text, color) {
      this.$vs.notification({
        // flat: true,
        title,
        text,
        position: 'bottom-center',
        color,
      });
    },

  },
};
const userStatusMixin = {
  methods: {
    async updateStatus(activity) {
      await statusCollection
        .doc(this.getUser.uid)
        .set({ activity }, { merge: true });
    },
  },
};

export { warningMixin, userStatusMixin };
