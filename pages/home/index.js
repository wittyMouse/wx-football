// pages/home/index.js
const api = require("../../api/index");
const util = require("../../utils/util");
const columns = require("./columns");
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    pageTop: app.globalData.pageTop,
    pageHeight: app.globalData.pageHeightWidthTabBar,
    tabBarHeight: app.globalData.tabBarHeight,
    scrollTop: 0,

    assetsURL: app.globalData.assetsURL,

    // 菜单弹窗显示状态
    showMenu: false,
    // 键盘弹起时，是否自动上推页面
    adjustPosition: false,
    route: "",

    articleListLoading: false,
    articleList: [],
    listLoading: false,
    rankingList: [],
    chartLoading: false,
    rankingChartData: [],

    // 当前激活 tab
    activeKey: "",

    columns,

    adConfigInfoLoading: false,
    bannerList: [],
  },

  /**
   * 获取广告配置信息
   * @param {*} params
   * @param {*} cb
   */
  getAdConfigInfo(params, cb) {
    this.setData({ adConfigInfoLoading: true });
    api
      .requestAdConfigInfo(params)
      .then((res) => {
        if (res.code === 0) {
          cb && cb(res.result);
        } else {
          console.error(res.message);
        }
      })
      .finally(() => {
        this.setData({ adConfigInfoLoading: false });
      });
  },

  /**
   * 获取文章列表
   * @param {*} params
   */
  getArticleList(params, cb) {
    this.setData({ articleListLoading: true });
    api
      .requestArticleList(params)
      .then((res) => {
        if (res.code === 0) {
          cb && cb(res.result);
        } else {
          console.error(res.message);
        }
      })
      .finally(() => {
        this.setData({ articleListLoading: false });
      });
  },

  /**
   * 获取胜率榜数据
   * @param {*} params
   * @param {*} cb
   */
  getRankingList(params) {
    this.setData({ listLoading: true });
    api
      .requestRankingList(params)
      .then((res) => {
        if (res.code === 0) {
          this.setData({ rankingList: res.result });
        } else {
          console.error(res.message);
        }
      })
      .finally(() => {
        this.setData({ listLoading: false });
      });
  },

  /**
   * 获取胜场榜数据
   * @param {*} params
   * @param {*} cb
   */
  getRankingChart(params) {
    this.setData({ chartLoading: true });
    api
      .requestRankingChart(params)
      .then((res) => {
        if (res.code === 0) {
          this.setData({ rankingChartData: res.result });
        } else {
          console.error(res.message);
        }
      })
      .finally(() => {
        this.setData({ chartLoading: false });
      });
  },

  /**
   * 点击购物车图标
   */
  bindCarClick() {
    wx.navigateTo({
      url: "/pages/shop-car/index",
    });
  },

  /**
   * 滑动事件
   * @param {*} e
   */
  bindScroll(e) {
    const { scrollTop } = e.detail;
    // todo 保存 scrollTop
  },

  /**
   * 点击菜单按钮
   */
  bindTriggerClick() {
    const { showMenu } = this.data;
    this.setData({
      showMenu: !showMenu,
    });
  },

  /**
   * 登录
   */
  bindLogin() {},

  /**
   * 退出
   */
  bindLogout() {},

  /**
   * 关闭登录框
   */
  bindClose() {
    this.setData({
      showMenu: false,
    });
  },

  /**
   * 点击浮动按钮
   * @param {*} e
   */
  bindFloatButtonClick(e) {
    const { target } = e.detail;
    // const { scrollTop } = this.data;
    switch (target) {
      case "wechat":
        // 微信
        break;
      case "phone":
        // 手机
        break;
      case "car":
        // 进入购物车
        if (this.route !== "pages/shop-car/index") {
          wx.navigateTo({ url: "/pages/shop-car/index" });
        }
        break;
      case "top":
        // 返回顶部
        // if (scrollTop !== 0) {
        //   this.setData({ scrollTop: 0 });
        // }
        this.setData({ scrollTop: 0 });
        break;
    }
  },

  /**
   * 切换 tabs
   * @param {*} e
   */
  bindTabsChange(e) {
    const { activeKey } = e.detail;
    this.setData({ activeKey });
  },

  /**
   * 点击胜率榜、胜场榜
   * @param {*} e
   */
  bindCardClick(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({ url: `/pages/recommend/detail/index?id=${id}` });
  },

  /**
   * 点击文章标题
   * @param {*} e
   */
  bindArticleClick(e) {
    // const { id } = e.currentTarget.dataset;
    const { id } = e.detail;
    wx.navigateTo({ url: `/pages/latest-clue/detail/index?id=${id}` });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { from } = options;
    const { token, systemInfo } = app.globalData;
    const adjustPosition = util.compareVersion(systemInfo.SDKVersion, "2.7.0") === -1;
    this.setData({ adjustPosition, route: this.route });

    this.getArticleList({ token }, (res) => {
      const data = {
        articleList: res,
      };
      if (from) {
        data.activeKey = res[1].columnId;
      } else {
        data.activeKey = res[0].columnId;
      }
      this.setData(data);
    });
    this.getRankingList({ token });
    this.getRankingChart({ token });
    this.getAdConfigInfo({ token }, (res) => {
      if (res && res[0]) {
        this.setData({ bannerList: res[0] });
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
});
