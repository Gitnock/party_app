module.exports = {
  // ...other vue-cli plugin options...
  pwa: {
    name: 'PartyApp',
    themeColor: '#4DBA87',
    msTileColor: '#161823',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
    manifestOptions: {
      start_url: './crew/@me',
    },

  },
};
