// pages/user-center/recharge/index.js
const api = require("../../../api/index");
const util = require("../../../utils/util");
const nonceStringArray = require("./nonceStringArray");
const columns = require("./columns");
const { dataSource } = require("./mock");
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

    columns,
    dataSource,

    activeKey: "",

    loading: false,
    createOrderLoading: false,
  },

  /**
   * 获取充值赠送配置列表
   * @param {*} params
   * @param {*} cb
   */
  getPriceList(params, cb) {
    this.setData({ loading: true });
    api
      .requestPriceList(params)
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
        this.setData({ loading: false });
      });
  },

  /**
   * 发起支付
   * @param {*} params
   * @param {*} cb
   */
  createOrder(params, cb) {
    this.setData({ createOrderLoading: true });
    api
      .requestCreateOrder(params)
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
        this.setData({ createOrderLoading: false });
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
   * 切换选中
   * @param {*} e
   */
  bindRadioClick(e) {
    const { value } = e.detail;
    const { activeKey } = this.data;
    if (activeKey !== value) {
      this.setData({ activeKey: value });
    }
  },

  /**
   * 获取用户信息
   * @param {*} e
   */
  // bindGetUserInfo(e) {
  //   console.log("userInfo", e);
  // },

  /**
   * 获取随机字符串
   * @param {*} size
   */
  getNonceString(size) {
    const max = nonceStringArray.length;
    let nonceSt = "";
    for (let i = 0; i < size; i++) {
      const index = Math.floor(max * Math.random());
      nonceSt += nonceStringArray[index];
    }
    return nonceSt;
  },

  /**
   * 立即购买
   */
  bindPay(e) {
    console.log("pay", e);
    const { token, openId } = app.globalData;
    const { activeKey } = this.data;
    const params = {
      token,
      openId,
      id: activeKey,
      env: "mini-program",
    };
    this.createOrder(params, (res) => {
      wx.requestPayment({
        ...res,
        success() {
          wx.navigateTo({
            url: "/pages/tips/index?type=success&title=充值成功",
          });
        },
        fail(err) {
          console.error(err);
        },
        complete() {},
      });
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { token, systemInfo } = app.globalData;
    const adjustPosition = util.compareVersion(systemInfo.SDKVersion, "2.7.0") === -1;
    this.setData({ adjustPosition, route: this.route });
    this.getPriceList({ token }, (res) => {
      this.setData({
        activeKey: res[0].id,
        dataSource: res,
      });
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
