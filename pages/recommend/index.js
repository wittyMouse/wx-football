// pages/recommend/index.js
const api = require("../../api/index");
const util = require("../../utils/util");
const Promise = require("../../utils/promise");
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

    dataSource1: {},
    dataSource2: {},
    dataSource3: {},

    panelScrollTop: {
      1: 0,
      2: 0,
      3: 0,
    },

    resultTextMap: {
      "-2": "负",
      "-1": "负",
      0: "走",
      1: "胜",
      2: "胜",
    },

    resultClassMap: {
      "-2": 3,
      "-1": 3,
      0: 2,
      1: 1,
      2: 1,
    },
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
          cb && cb();
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
    const { scrollTop, panelScrollTop } = this.data;
    const _scrollTop = panelScrollTop[target];

    if (scrollTop !== _scrollTop) {
      this.setData({ scrollTop: _scrollTop });
    }
  },

  /**
   * 点击卡片
   * @param {*} e
   */
  bindCardClick(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({ url: `/pages/recommend/detail/index?id=${id}` });
  },

  /**
   * 获取数据
   */
  getDataSource() {
    const { token } = app.globalData;
    // 至尊精选推荐
    const pm1 = api.requestAuthorInfoList({ token, departId: 4 });
    // 合作机构
    const pm2 = api.requestAuthorInfoList({ token, departId: 5 });
    // 至尊赢利套餐
    const pm3 = api.requestAuthorInfoList({ token, departId: 6 });

    this.setData({ pageLoading: true });
    Promise.all([pm1, pm2, pm3])
      .then((res) => {
        const data = {};
        if (res[0].code === 0) {
          data.dataSource1 = res[0].result;
        } else {
          wx.showToast({
            title: res.message,
            icon: "none",
          });
        }

        if (res[1].code === 0) {
          data.dataSource2 = res[1].result;
        } else {
          wx.showToast({
            title: res.message,
            icon: "none",
          });
        }

        if (res[2].code === 0) {
          data.dataSource3 = res[2].result;
        } else {
          wx.showToast({
            title: res.message,
            icon: "none",
          });
        }
        this.setData(data, () => {
          // 存储 panel 的位置
          const that = this;
          const query = wx.createSelectorQuery();
          query.selectAll(".recommend-panel").boundingClientRect();
          query.exec((res) => {
            // console.log(res[0]);
            const panelScrollTop = {
              1: 0,
              2: res[0][1].top - res[0][0].top,
              3: res[0][2].top - res[0][0].top,
            };
            that.setData({ panelScrollTop });
          });
        });
      })
      .finally(() => {
        this.setData({ pageLoading: false });
      });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { systemInfo } = app.globalData;
    const adjustPosition = util.compareVersion(systemInfo.SDKVersion, "2.7.0") === -1;
    this.setData({ adjustPosition, route: this.route });
    this.getDataSource();
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
