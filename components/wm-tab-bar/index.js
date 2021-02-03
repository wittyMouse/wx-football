// components/wm-tab-bar/index.js
const app = getApp();

Component({
  options: {
    addGlobalClass: true,
  },

  /**
   * 组件的属性列表
   */
  properties: {
    route: {
      type: String,
      value: "",
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    assetsURL: app.globalData.assetsURL,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    bindClick(e) {
      // console.log(e)
      const { target, url } = e.currentTarget.dataset;
      const { route } = this.data;
      switch (target) {
        case "link":
          if (url !== `/${route}`) {
            wx.reLaunch({
              url,
            });
          }
          break;
        case "menu":
          this.triggerEvent(target);
          break;
      }
    },
  },
});
