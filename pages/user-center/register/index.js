// pages/user-center/register/index.js
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
    registerFormData: {
      account: "",
      pwd: "",
      confirmPwd: "",
      mobile: "",
      // nickname: "",
      // channelId: "",
      // wechatAccount: "",
      // verificationKey: "",
      verificationCode: "",
    },

    // 表单聚焦
    registerFormFocus: {
      account: false,
      pwd: false,
      confirmPwd: false,
      mobile: false,
      // wechatAccount: false,
      verificationCode: false,
    },

    // 键盘显示状态
    showKeyboard: false,
    // 键盘高度
    keyboardHeight: 0,

    phoneCodeLoading: false,

    showCaptchaModal: false,

    captchaForm: {
      captcha: "",
      checkKey: "",
    },
  },

  /**
   * 获取验证码
   * @param {*} params
   * @param {*} cb
   */
  getCaptcha(params, cb) {
    this.setData({ captchaLoading: true });
    api
      .requestCaptcha({ timestamp: params.mobile })
      .then((res) => {
        if (res.code === 0) {
          this.setData({ captchaImage: res.result });
          cb && cb();
        }
      })
      .finally(() => {
        this.setData({ captchaLoading: false });
      });
  },

  /**
   * 发送短信验证码
   * @param {*} params
   * @param {*} cb
   */
  getPhoneCode(params, cb) {
    this.setData({ phoneCodeLoading: true });
    api
      .requestPhoneCode(params)
      .then((res) => {
        if (res.code === 0) {
          wx.showToast({
            title: "验证码已发送",
            icon: "none",
          });
          cb && cb();
        } else {
          wx.showToast({
            title: res.message,
            icon: "none",
          });
        }
      })
      .finally(() => {
        this.setData({ phoneCodeLoading: false });
      });
  },

  /**
   * 注册
   * @param {*} params
   * @param {*} cb
   */
  register(params, cb) {
    this.setData({ submitting: true });
    api
      .requestRegister(params)
      .then((res) => {
        if (res.code === 0) {
          wx.showToast({
            title: "注册成功",
            icon: "none",
          });
          cb && cb();
        } else {
          wx.showToast({
            title: res.message,
            icon: "none",
          });
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
  bindLogin() {
    wx.reLaunch({ url: "/pages/home/index" });
  },

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
   * 输入事件
   * @param {*} e
   */
  bindInput(e) {
    // console.log(e);
    const { field } = e.currentTarget.dataset;
    const { value } = e.detail;
    this.setData({
      [`registerFormData.${field}`]: value,
    });
  },

  /**
   * 聚焦事件
   * @param {*} e
   */
  bindFocus(e) {
    // console.log(e);
    const { field } = e.currentTarget.dataset;
    const { registerFormFocus, adjustPosition } = this.data;

    // const { height } = e.detail;
    // const data = {
    //   showKeyboard: true,
    //   keyboardHeight: height
    // };

    const data = {};
    if (adjustPosition) {
      data.showKeyboard = true;
    }

    if (!registerFormFocus[field]) {
      data[`registerFormFocus.${field}`] = true;
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
    const { registerFormFocus, adjustPosition } = this.data;

    // const { tabBarHeight, registerFormFocus } = this.data;
    // this.setData({ showKeyboard: false, popUpBottom: tabBarHeight });

    const data = {};
    if (adjustPosition) {
      data.showKeyboard = false;
    }

    if (registerFormFocus[field]) {
      data[`registerFormFocus.${field}`] = false;
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
    const { registerFormFocus } = this.data;
    const data = {};
    if (registerFormFocus[field]) {
      data[`registerFormFocus.${field}`] = false;
    }
    if (next) {
      data[`registerFormFocus.${next}`] = true;
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
   * 获取验证码
   */
  bindGetCaptcha() {
    const { mobile } = this.data.registerFormData;
    if (!mobile) {
      wx.showToast({
        title: "请先输入手机号",
        icon: "none",
      });
      return;
    }

    this.getCaptcha({ mobile }, () => {
      this.setData({ showCaptchaModal: true, ["captchaForm.checkKey"]: mobile });
    });
  },

  /**
   * 关闭获取验证码弹窗
   */
  bindCaptchaModalClose() {
    this.setData({
      showCaptchaModal: false,
      captchaForm: {
        captcha: "",
        checkKey: "",
      },
    });
  },

  /**
   * 更换验证码
   * @param {*} e
   */
  bindCaptchaClick(e) {
    const { target } = e.currentTarget.dataset;
    const { captchaLoading, registerFormData } = this.data;
    const { mobile } = registerFormData;
    switch (target) {
      case "captcha":
        if (captchaLoading) {
          return;
        }
        this.getCaptcha({ mobile });
        break;
    }
  },

  /**
   * 验证码弹窗输入
   * @param {*} e
   */
  bindCaptchaInput(e) {
    const { value } = e.detail;
    this.setData({ ["captchaForm.captcha"]: value });
  },

  /**
   * 获取验证码弹窗提交
   * @param {*} e
   */
  bindCaptchaModalSubmit(e) {
    const { value: values } = e.detail;
    const { phoneCodeLoading } = this.data;

    if (!values.captcha) {
      wx.showToast({
        title: "请输入验证码",
        icon: "none",
      });
      return;
    }

    if (phoneCodeLoading) {
      return;
    }
    this.getPhoneCode(values, () => {
      this.bindCaptchaModalClose();
    });
  },

  /**
   * 提交表单
   * @param {*} e
   */
  bindSubmit(e) {
    // console.log(e);
    const { value } = e.detail;
    const { submitting } = this.data;
    const params = {
      ...value,
      nickname: value.account,
      channelId: "",
      verificationKey: value.mobile,
    };

    if (submitting) {
      return;
    }

    this.register(params, () => {
      wx.redirectTo({ url: "/pages/tips/index?type=success&title=注册成功" });
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { systemInfo } = app.globalData;
    const adjustPosition = util.compareVersion(systemInfo.SDKVersion, "2.7.0") === -1;
    this.setData({ adjustPosition, route: this.route });
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
