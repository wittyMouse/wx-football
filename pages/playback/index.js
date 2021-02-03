// pages/playback/index.js
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

    // 数据加载状态
    loading: false,
    // 录音列表
    dataSource: [],
    // 请求参数
    requestParams: {
      queryTime: "",
    },

    // 当前激活 tab 面板的 key
    activeKey: "",

    // 音频列表
    audioList: [],

    // 当前播放音频
    currentAudio: -1,
  },

  /**
   * 获取录音列表
   * @param {*} params
   */
  getRecordList(params, cb) {
    this.setData({ loading: true });
    api
      .requestRecordList(params)
      .then((res) => {
        // console.log(res);
        if (res.code === 0) {
          cb && cb(res.result);
        } else {
          // todo
          console.error(res.message);
        }
      })
      .finally(() => {
        this.setData({ loading: false });
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
   * 切换 tabs
   * @param {*} e
   */
  bindTabsChange(e) {
    // console.log(e);
    const { activeKey } = e.detail;
    this.setData({ activeKey });
  },

  /**
   * 点击录音列表项
   * @param {*} e
   */
  bindClick(e) {
    const { x, y } = e.currentTarget.dataset;
    const { dataSource, audioList } = this.data;
    const key = `${x},${y}`;
    const idx = audioList.findIndex((item) => item.key === key);
    const data = {};
    if (idx > -1) {
      data.currentAudio = idx;
    } else {
      const audio = {
        key,
        title: dataSource[x].itemName,
        src: dataSource[x].recordList[y].filePath,
      };
      data.currentAudio = audioList.length;
      audioList.push(audio);
      data.audioList = audioList;
    }
    this.setData(data);
  },

  /**
   * 音频切换
   * @param {*} e
   */
  bindAudioChange(e) {
    const { target } = e.detail;
    const { audioList, currentAudio } = this.data;
    if (audioList.length < 2) {
      return;
    }

    const data = {};
    switch (target) {
      case "prev":
        if (currentAudio === 0) {
          data.currentAudio = audioList.length - 1;
        } else {
          data.currentAudio = currentAudio - 1;
        }
        break;
      case "next":
        if (currentAudio === audioList.length - 1) {
          data.currentAudio = 0;
        } else {
          data.currentAudio = currentAudio + 1;
        }
        break;
    }
    this.setData(data);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { token, systemInfo } = app.globalData;
    const adjustPosition = util.compareVersion(systemInfo.SDKVersion, "2.7.0") === -1;
    this.setData({ adjustPosition, route: this.route });

    const queryTime = util.formatDate(new Date(), "YYYY-MM");
    const params = { queryTime, token };
    this.getRecordList(params, (res) => {
      this.setData({
        ["requestParams.queryTime"]: queryTime,
        activeKey: 0,
        dataSource: res,
      });

      // test 测试
      // const dataSource = res;
      // const testData = {
      //   ...res[0],
      //   itemName: "中山电台FM88.8",
      //   itemDesc: "周一至周日",
      // };
      // dataSource.push(testData);
      // dataSource.push(testData);
      // dataSource.push(testData);
      // dataSource.push(testData);
      // dataSource.push(testData);
      // dataSource.push(testData);
      // dataSource.push(testData);
      // dataSource.push(testData);
      // this.setData({
      //   ["requestParams.queryTime"]: queryTime,
      //   activeKey: 0,
      //   dataSource,
      // });
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
