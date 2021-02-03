// components/wm-menu/index.js
const api = require("../../api/index");
const app = getApp();

Component({
  options: {
    addGlobalClass: true,
  },

  /**
   * 组件的属性列表
   */
  properties: {
    // popup 显示状态
    show: {
      type: Boolean,
      value: false,
    },
    // 键盘弹起时，是否自动上推页面
    adjustPosition: {
      type: Boolean,
      value: false,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    tabBarHeight: app.globalData.tabBarHeight,
    assetsURL: app.globalData.assetsURL,
    isLogin: false,

    // 用户信息
    userInfo: {},

    // 表单提交状态
    submitting: false,

    // 加载用户信息状态
    pageLoading: false,

    // 验证码加载状态
    captchaLoading: false,

    // 验证码图片地址
    captchaImage: "",

    // 表单数据
    loginFormData: {
      account: "",
      pwd: "",
      type: "0",
      verificationKey: "",
      verificationCode: "",
    },

    // 表单聚焦
    loginFormFocus: {
      account: false,
      pwd: false,
      verificationCode: false,
    },

    // 键盘显示状态
    showKeyboard: false,
    // 键盘高度
    keyboardHeight: 0,
  },

  // 数据监听器
  observers: {
    show(val) {
      if (val) {
        const { token } = app.globalData;
        this.getCaptcha();
        this.setData({ isLogin: !!token });

        if (token) {
          this.getUserInfo({ token }, (userInfo) => {
            app.globalData.userInfo = userInfo;
            this.setData({ userInfo });
          });
        }
      }
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 获取验证码
     * @param {*} params
     * @param {*} cb
     */
    getCaptcha() {
      const timestamp = Date.now().toString();
      this.setData({ captchaLoading: true, ["loginFormData.verificationKey"]: timestamp });
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
     * 登录
     * @param {*} params
     * @param {*} cb
     */
    login(params, cb) {
      this.setData({ submitting: true });
      api
        .requestLogin(params)
        .then((res) => {
          if (res.code === 0) {
            cb && cb(res.result);
          } else {
            wx.showToast({
              title: res.message,
              icon: "none",
            });
            this.getCaptcha();
            this.setData({ submitting: false });
          }
        })
        .catch((err) => {
          console.error(err);
          this.setData({ submitting: false });
        });
    },

    /**
     * 获取会员信息
     * @param {*} params
     * @param {*} cb
     */
    getUserInfo(params, cb) {
      this.setData({ pageLoading: true });
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
          this.setData({ pageLoading: false });
        });
    },

    /**
     * 退出登录
     * @param {*} params
     * @param {*} cb
     */
    logout(params, cb) {
      api.requestLogout(params).then((res) => {
        if (res.code === 0) {
          cb && cb();
        } else {
          console.error(res.message);
        }
      });
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
        [`loginFormData.${field}`]: value,
      });
    },

    /**
     * 聚焦事件
     * @param {*} e
     */
    bindFocus(e) {
      // console.log(e);
      const { field } = e.currentTarget.dataset;
      const { loginFormFocus, adjustPosition } = this.data;

      // const { height } = e.detail;
      // const data = {
      //   showKeyboard: true,
      //   keyboardHeight: height
      // };

      const data = {};
      if (adjustPosition) {
        data.showKeyboard = true;
      }

      if (!loginFormFocus[field]) {
        data[`loginFormFocus.${field}`] = true;
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
      const { loginFormFocus, adjustPosition } = this.data;

      // const { tabBarHeight, loginFormFocus } = this.data;
      // this.setData({ showKeyboard: false, popUpBottom: tabBarHeight });

      const data = {};
      if (adjustPosition) {
        data.showKeyboard = false;
      }

      if (loginFormFocus[field]) {
        data[`loginFormFocus.${field}`] = false;
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
      const { loginFormFocus } = this.data;
      const data = {};
      if (loginFormFocus[field]) {
        data[`loginFormFocus.${field}`] = false;
      }
      if (next) {
        data[`loginFormFocus.${next}`] = true;
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
     * 切换有效期
     * @param {*} e
     */
    bindChange(e) {
      // console.log(e);
      const { field } = e.currentTarget.dataset;
      const { value } = e.detail;
      this.setData({
        [`loginFormData.${field}`]: value,
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
        type: Number(value.type),
      };

      if (submitting) {
        return;
      }

      this.login(params, (token) => {
        api
          .requestUserInfo({ token })
          .then((res) => {
            if (res.code === 0) {
              const userInfo = res.result;
              app.globalData.token = token;
              app.globalData.userInfo = userInfo;
              this.setData({
                isLogin: true,
                userInfo,
                captchaImage: "",
                loginFormData: {
                  account: "",
                  pwd: "",
                  type: "0",
                  verificationKey: "",
                  verificationCode: "",
                },
              });
              this.triggerEvent("login");
            } else {
              this.logout({ token });
            }
            this.setData({ submitting: false });
          })
          .catch((err) => {
            console.error(err);
            this.setData({ submitting: false });
          });
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
        case "register":
          wx.navigateTo({
            url: "/pages/user-center/register/index",
          });
          break;
      }
    },

    /**
     * 退出
     */
    bindLogOut() {
      const { token } = app.globalData;
      this.logout({ token }, () => {
        app.globalData.token = "";
        app.globalData.userInfo = {};
        this.setData({ isLogin: false, userInfo: {} });
        this.getCaptcha();
        this.triggerEvent("logout");
      });
    },

    /**
     * 点击菜单导航
     * @param {*} e
     */
    bindMenuClick(e) {
      const { target, page } = e.currentTarget.dataset;
      let url = "";
      // const pages = getCurrentPages();
      // console.log(pages[0].route);

      // todo 防止跳到当前页

      switch (target) {
        case "record":
          url = `/pages/user-center/record/index?target=${page}`;
          break;
        case "recharge":
          url = "/pages/user-center/recharge/index";
          break;
        case "modify":
          url = "/pages/user-center/modify/index";
          break;
      }
      wx.navigateTo({ url });
    },

    /**
     * 关闭登录框
     */
    bindClose() {
      const { showKeyboard } = this.data;
      if (showKeyboard) {
        return;
      }
      this.triggerEvent("close");
    },

    /**
     * 登录框完全关闭后的回调
     */
    bindClosed() {
      this.setData({
        captchaImage: "",
        loginFormData: {
          account: "",
          pwd: "",
          type: "0",
          verificationKey: "",
          verificationCode: "",
        },
      });
    },
  },
});
