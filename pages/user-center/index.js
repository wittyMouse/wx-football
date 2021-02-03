// pages/user-center/index.js
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

    userInfo: {},
    userInfoLoading: false,

    checkInInfo: {},
    checkInInfoLoading: false,
    checkInLoading: false,

    checkInConfigLoading: false,
    checkInConfig: [],
  },

  /**
   * 获取会员信息
   * @param {*} params
   * @param {*} cb
   */
  // getUserInfo(params, cb) {
  //   this.setData({ userInfoLoading: true });
  //   api
  //     .requestUserInfo(params)
  //     .then((res) => {
  //       if (res.code === 0) {
  //         cb && cb(res.result);
  //       } else {
  //         wx.showToast({
  //           title: res.message,
  //           icon: "none",
  //         });
  //       }
  //     })
  //     .finally(() => {
  //       this.setData({ userInfoLoading: false });
  //     });
  // },

  /**
   * 获取签到配置
   * @param {*} params
   * @param {*} cb
   */
  getCheckInConfig(params, cb) {
    this.setData({ checkInConfigLoading: true });
    api
      .requestCheckInConfig(params)
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
        this.setData({ checkInConfigLoading: false });
      });
  },

  /**
   * 获取签到信息
   * @param {*} params
   * @param {*} cb
   */
  getCheckInInfo(params, cb) {
    this.setData({ checkInInfoLoading: true });
    api
      .requestCheckInInfo(params)
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
        this.setData({ checkInInfoLoading: false });
      });
  },

  /**
   * 签到
   * @param {*} params
   * @param {*} cb
   */
  checkIn(params, cb) {
    this.setData({ checkInLoading: true });
    api
      .requestCheckIn(params)
      .then((res) => {
        if (res.code === 0) {
          cb && cb();
        } else {
          wx.showToast({
            title: res.message,
            icon: "none",
          });
        }
      })
      .finally(() => {
        this.setData({ checkInLoading: false });
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
  bindLogin() {},

  /**
   * 退出
   */
  bindLogout() {
    wx.reLaunch({ url: "/pages/home/index" });
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
   * 签到
   */
  bindCheckInClick() {
    const { token } = app.globalData;
    const { checkInLoading } = this.data;
    if (checkInLoading) {
      return;
    }
    this.checkIn({ token }, () => {
      wx.showToast({
        title: "签到成功",
        icon: "none",
      });
      this.getCheckInInfo({ token }, (res) => {
        app.globalData.userInfo.integral = res.integral;
        this.setData({
          checkInInfo: res,
          ["userInfo.integral"]: res.integral,
        });
      });
    });
  },

  /**
   * 点击导航栏
   * @param {*} e
   */
  bindNavClick(e) {
    const { url } = e.currentTarget.dataset;
    wx.navigateTo({ url });
  },

  /**
   * 点击文章
   * @param {*} e
   */
  bindArticleClick(e) {
    const { id } = e.currentTarget.dataset;
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { token, systemInfo, userInfo } = app.globalData;
    const adjustPosition = util.compareVersion(systemInfo.SDKVersion, "2.7.0") === -1;
    this.setData({ adjustPosition, route: this.route, userInfo });

    this.getCheckInConfig({ token }, (res) => {
      this.setData({ checkInConfig: res });
    });
    this.getCheckInInfo({ token }, (res) => {
      this.setData({ checkInInfo: res });
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
