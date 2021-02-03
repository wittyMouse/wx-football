// pages/home/components/wm-banner/index.js
const app = getApp();

Component({
  options: {
    addGlobalClass: true,
  },

  /**
   * 组件的属性列表
   */
  properties: {
    bannerList: {
      type: Array,
      value: [],
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    assetsURL: app.globalData.assetsURL,

    // 当前所在滑块的 index
    current: 0,
    // 自动切换
    autoplay: true,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * current 改变时会触发 change 事件
     * @param {*} e
     */
    bindChange(e) {
      const { current, source } = e.detail;
      // if (source === 'touch') {
      this.setData({ current });
      // }
    },

    /**
     * 点击切换按钮
     * @param {*} e
     */
    bindClick(e) {
      // console.log(e)
      const { type } = e.currentTarget.dataset;
      const { bannerList, current } = this.data;

      // 防止控制器和 autoplay 同时切换 current
      this.setData({ autoplay: false });

      let _current = 0;
      const maxIndex = bannerList.length - 1;
      switch (type) {
        case "prev":
          _current = current !== 0 ? current - 1 : maxIndex;
          break;
        case "next":
          _current = current !== maxIndex ? current + 1 : 0;
          break;
      }

      this.setData({
        current: _current,
        autoplay: true,
      });
    },

    /**
     * 点击 banner 图
     * @param {*} e
     */
    bindBannerClick(e) {
      const { index } = e.currentTarget.dataset;
      const { bannerList } = this.data;
      const url = bannerList[index].pageUrl;
      if (url) {
        wx.navigateTo({ url: `/pages/web-view/index?url=${encodeURIComponent(url)}` });
      }
    },
  },
});
