/* eslint-disable import/prefer-default-export */
const warningMixen = {
  data: () => ({
    avatarSize: '55',
    btnSize: '44',
  }),
  methods: {
    setSize() {
      const x = window.matchMedia('(max-width: 700px)');
      if (x.matches) {
        this.avatarSize = '44';
        this.btnSize = '28';
      } else {
        this.avatarSize = '55';
        this.btnSize = '44';
      }
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
  },
  mounted() {
    this.setSize();
  },
};

export { warningMixen };
