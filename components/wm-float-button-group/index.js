// components/wm-float-button-group/index.js
const app = getApp();

Component({
  options: {
    addGlobalClass: true,
  },

  /**
   * 组件的属性列表
   */
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {
    assetsURL: app.globalData.assetsURL,
    phoneNumber: "4000001357",
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 点击图标
     * @param {*} e
     */
    bindClick(e) {
      // console.log(e);
      const { target } = e.currentTarget.dataset;
      const { phoneNumber } = this.data;
      switch (target) {
        case "wechat":
          wx.previewImage({
            urls: [`https://www.df1668.com/images/qrcode.jpg?timestamp=${Date.now()}`],
          });
          break;
        case "phone":
          wx.makePhoneCall({
            phoneNumber,
          });
          break;
      }
      this.triggerEvent("click", { target });
    },
  },
});
