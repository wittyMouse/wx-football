// pages/latest-clue/detail/index.js
const api = require("../../../api/index");
const util = require("../../../utils/util");
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

    isLogin: false,
    userInfo: {},

    pageLoading: false,
    dataSource: {},

    reload: false,

    showTipsModal: false,
  },

  /**
   * 获取用户信息
   * @param {*} params
   * @param {*} cb
   */
  getUserInfo(params, cb) {
    this.setData({ userInfoLoading: true });
    api
      .requestUserInfo(params)
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
        this.setData({ userInfoLoading: false });
      });
  },

  /**
   * 获取文章详情
   * @param {*} params
   * @param {*} cb
   */
  getArticleDetail(params, cb) {
    this.setData({ pageLoading: true });
    api
      .requestArticleDetail(params)
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
   * 购买文章
   * @param {*} params
   * @param {*} cb
   */
  buyArticle(params, cb) {
    api.requestBuyArticle(params).then((res) => {
      if (res.code === 0) {
        wx.showToast({
          title: "购买成功",
          icon: "none",
        });
        cb && cb();
      } else {
        wx.showToast({
          title: res.message,
          icon: "none",
        });
      }
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
   * 点击返回图标
   */
  bindBackClick() {
    wx.navigateBack();
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
  bindLogin() {
    const { id } = this.data;
    const { token, userInfo } = app.globalData;
    this.setData({ userInfo, isLogin: true });
    this.getArticleDetail({ token, articleId: id }, (res) => {
      this.setData({ dataSource: res });
    });
  },

  /**
   * 退出
   */
  bindLogout() {
    this.setData({ isLogin: false });
  },

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
   * 点击立即订购
   * @param {*} e
   */
  bindButtonClick(e) {
    const { target } = e.currentTarget.dataset;
    switch (target) {
      case "login":
        this.setData({ showMenu: true });
        break;
      case "buy":
        this.setData({ showTipsModal: true });
        break;
      case "recharge":
        wx.navigateTo({ url: "/pages/user-center/recharge/index" });
        break;
    }
  },

  /**
   * 确认购买
   */
  bindBuyClick() {
    const { token } = app.globalData;
    const { id } = this.data;
    this.buyArticle({ token, articleId: id }, () => {
      this.bindTipsModalClose();

      this.getUserInfo({ token }, (res) => {
        app.globalData.userInfo = res;
        this.setData({ userInfo: res });
      });
      this.getArticleDetail({ token, articleId: id }, (res) => {
        this.setData({ dataSource: res });
      });
    });
  },

  /**
   * 关闭确认框
   */
  bindTipsModalClose() {
    this.setData({ showTipsModal: false });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { id } = options;
    const { token, systemInfo, userInfo } = app.globalData;
    const adjustPosition = util.compareVersion(systemInfo.SDKVersion, "2.7.0") === -1;
    this.setData({ adjustPosition, route: this.route, id, userInfo, isLogin: !!token });

    this.getArticleDetail({ token, articleId: id }, (res) => {
      this.setData({ dataSource: res });
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const { token, userInfo } = app.globalData;
    this.setData({ userInfo, isLogin: !!token });
  },

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
