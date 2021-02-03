// pages/latest-clue/index.js
const api = require("../../api/index");
const util = require("../../utils/util");
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

    pageLoading: false,
    dataSource: [],

    authorList: [],

    picker: {
      1: false,
    },
  },

  /**
   * 最新发布
   * @param {*} params
   * @param {*} cb
   */
  getLatestArticleList(params, cb) {
    this.setData({ pageLoading: true });
    api
      .requestLatestArticleList(params)
      .then((res) => {
        if (res.code === 0) {
          cb && cb(res.result);
        } else {
          wx.showToast({
            title: res.message,
            icon: "none",
          });
        }
      })
      .finally(() => {
        this.setData({ pageLoading: false });
      });
  },

  /**
   * 根据部门 Id 获取用户信息
   * @param {*} params
   * @param {*} cb
   */
  getAuthorInfoList(params, cb) {
    this.setData({ pageLoading: true });
    api
      .requestAuthorInfoList(params)
      .then((res) => {
        if (res.code === 0) {
          cb && cb(res.result);
        } else {
          wx.showToast({
            title: res.message,
            icon: "none",
          });
        }
      })
      .finally(() => {
        this.setData({ pageLoading: false });
      });
  },

  /**
   * 回到首页
   */
  bindLogoClick() {
    wx.reLaunch({
      url: "/pages/home/index",
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
   * 点击导航栏
   * @param {*} e
   */
  bindNavClick(e) {
    const { target } = e.currentTarget.dataset;
    const { picker } = this.data;
    const _picker = {};
    Object.keys(picker).forEach((key) => {
      _picker[key] = false;
      if (target === key && !picker[key]) {
        _picker[key] = true;
      }
    });
    this.setData({ picker: _picker });
  },

  /**
   * 点击作者
   * @param {*} e
   */
  bindAuthorClick(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({ url: `/pages/latest-clue/profile/index?id=${id}` });
  },

  /**
   * 点击卡片
   * @param {*} e
   */
  bindCardClick(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({ url: `/pages/latest-clue/detail/index?id=${id}` });
  },

  /**
   * 点击热门线报跳转到首页的当日热点
   */
  bindTitleClick() {
    wx.navigateTo({ url: `/pages/home/index?from=${encodeURIComponent("latest-clue")}` });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { token, systemInfo } = app.globalData;
    const adjustPosition = util.compareVersion(systemInfo.SDKVersion, "2.7.0") === -1;
    this.setData({ adjustPosition, route: this.route });

    this.getLatestArticleList({ token, columnIds: ["3", "524377944060203023"] }, (res) => {
      this.setData({ dataSource: res });
    });

    this.getAuthorInfoList({ token, departId: "9" }, (res) => {
      this.setData({ authorList: res });
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
