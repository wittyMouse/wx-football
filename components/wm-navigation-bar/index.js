// components/wm-navigation-bar/index.js
const app = getApp();

Component({
  options: {
    addGlobalClass: true,
  },

  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: "",
    },
    showBack: {
      type: Boolean,
      value: false,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    navigationBarHeight: app.globalData.navigationBarHeight,
    assetsURL: app.globalData.assetsURL,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 点击图标
    bindClick(e) {
      // console.log(e);
      const { target } = e.currentTarget.dataset;
      this.triggerEvent(target);
    },
  },
});
