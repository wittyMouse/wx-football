// pages/user-center/modify/index.js
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

    // 表单提交状态
    submitting: false,

    // 验证码加载状态
    captchaLoading: false,

    // 验证码图片地址
    captchaImage: "",

    // 表单数据
    modifyFormData: {
      account: "",
      oldPwd: "",
      newPwd: "",
      confirmPwd: "",
      // email: "",
      // mobile: "",
      // nickname: "",
      // channelId: "",
      // wechatAccount: "",
      verificationKey: "",
      verificationCode: "",
    },

    // 表单聚焦
    modifyFormFocus: {
      account: false,
      oldPwd: false,
      newPwd: false,
      confirmPwd: false,
      // email: false,
      // mobile: false,
      wechatAccount: false,
      verificationCode: false,
    },

    // 键盘显示状态
    showKeyboard: false,
    // 键盘高度
    keyboardHeight: 0,

    userInfo: {},
  },

  /**
   * 获取验证码
   * @param {*} params
   * @param {*} cb
   */
  getCaptcha() {
    const timestamp = Date.now().toString();
    this.setData({ captchaLoading: true, ["modifyFormData.verificationKey"]: timestamp });
    api
      .requestCaptcha({ timestamp })
      .then((res) => {
        if (res.code === 0) {
          this.setData({ captchaImage: res.result });
        }
      })
      .finally(() => {
        this.setData({ captchaLoading: false });
      });
  },

  /**
   * 修改会员信息
   * @param {*} params
   * @param {*} cb
   */
  modify(params, cb) {
    this.setData({ submitting: true });
    api
      .requestModify(params)
      .then((res) => {
        if (res.code === 0) {
          wx.showToast({
            title: "修改成功",
            icon: "none",
          });
          cb && cb();
        } else {
          wx.showToast({
            title: res.message,
            icon: "none",
          });
          this.getCaptcha();
          this.setData({ ["modifyFormData.verificationCode"]: "" });
        }
      })
      .finally(() => {
        this.setData({ submitting: false });
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
   * 输入事件
   * @param {*} e
   */
  bindInput(e) {
    // console.log(e);
    const { field } = e.currentTarget.dataset;
    const { value } = e.detail;
    this.setData({
      [`modifyFormData.${field}`]: value,
    });
  },

  /**
   * 聚焦事件
   * @param {*} e
   */
  bindFocus(e) {
    // console.log(e);
    const { field } = e.currentTarget.dataset;
    const { modifyFormFocus, adjustPosition } = this.data;

    // const { height } = e.detail;
    // const data = {
    //   showKeyboard: true,
    //   keyboardHeight: height
    // };

    const data = {};
    if (adjustPosition) {
      data.showKeyboard = true;
    }

    if (!modifyFormFocus[field]) {
      data[`modifyFormFocus.${field}`] = true;
    }
    this.setData(data);
  },

  /**
   * 失焦事件
   * @param {*} e
   */
  bindBlur(e) {
    // console.log(e);
    const { field } = e.currentTarget.dataset;
    const { modifyFormFocus, adjustPosition } = this.data;

    // const { tabBarHeight, modifyFormFocus } = this.data;
    // this.setData({ showKeyboard: false, popUpBottom: tabBarHeight });

    const data = {};
    if (adjustPosition) {
      data.showKeyboard = false;
    }

    if (modifyFormFocus[field]) {
      data[`modifyFormFocus.${field}`] = false;
    }
    this.setData(data);
  },

  /**
   * 键盘点击完成按钮时触发
   * @param {*} e
   */
  bindConfirm(e) {
    // console.log(e);
    const { field, next } = e.currentTarget.dataset;
    const { modifyFormFocus } = this.data;
    const data = {};
    if (modifyFormFocus[field]) {
      data[`modifyFormFocus.${field}`] = false;
    }
    if (next) {
      data[`modifyFormFocus.${next}`] = true;
    }
    this.setData(data);
  },

  /**
   * 键盘高度发生变化的时候触发此事件
   * @param {*} e
   */
  bindKeyboardHeightChange(e) {
    // const { height, duration } = e.detail;
    // console.log("keyboardHeightChange", `height: ${height}; duration: ${duration}`);

    const { height } = e.detail;
    const { adjustPosition, keyboardHeight } = this.data;
    if (adjustPosition) {
      return;
    }

    if (height !== keyboardHeight) {
      this.setData({
        showKeyboard: height !== 0,
        keyboardHeight: height,
      });
    }
  },

  /**
   * 提交表单
   * @param {*} e
   */
  bindSubmit(e) {
    // console.log(e);
    const { value } = e.detail;
    const { token } = app.globalData;
    const { submitting } = this.data;
    const params = {
      ...value,
      nickname: value.account,
      channelId: "",
      token,
    };

    if (submitting) {
      return;
    }

    this.modify(params, () => {
      wx.redirectTo({ url: "/pages/tips/index?type=success&title=修改成功" });
    });
  },

  /**
   * 点击事件
   * @param {*} e
   */
  bindClick(e) {
    const { target } = e.currentTarget.dataset;
    const { captchaLoading } = this.data;
    switch (target) {
      case "captcha":
        if (captchaLoading) {
          return;
        }
        this.getCaptcha();
        break;
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { systemInfo, userInfo } = app.globalData;
    const adjustPosition = util.compareVersion(systemInfo.SDKVersion, "2.7.0") === -1;
    this.setData({ adjustPosition, route: this.route, userInfo });
    this.getCaptcha();
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
