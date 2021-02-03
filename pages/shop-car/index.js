// pages/shop-car/index.js
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

    dataSource: [],

    orderMap: {
      0: {
        label: "单日",
        prop: "dayAmount",
        unit: "金币",
      },
      1: {
        label: "包周",
        prop: "weekAmount",
        unit: "金币",
      },
      2: {
        label: "单日积分",
        prop: "monthAmount",
        unit: "积分",
      },
    },

    // 选中项的 key 数组
    selectedRowKeys: [],
    // 全选
    checkAll: false,

    total: 0,
    // totalPoints: 0,

    userInfoLoading: false,
    submitting: false,
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
   * 至尊推介订阅批量下单
   * @param {*} params
   * @param {*} cb
   */
  batchSubscribe(params, cb) {
    this.setData({ submitting: true });
    api
      .requestBatchSubscribe(params)
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
    this.getDataSource();
  },

  /**
   * 退出
   */
  bindLogout() {
    this.setData({ dataSource: [] });
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
   * 点击多选框
   * @param {*} e
   */
  bindCheckClick(e) {
    // console.log(e);
    const { value } = e.detail;
    const { selectedRowKeys, dataSource, orderMap, checkAll } = this.data;
    const idx = selectedRowKeys.findIndex((key) => key === value);
    const data = {};
    if (idx > -1) {
      // 去除选中
      selectedRowKeys.splice(idx, 1);
      if (checkAll) {
        data.checkAll = false;
      }
    } else {
      // 选中
      selectedRowKeys.push(value);
      if (selectedRowKeys.length === dataSource.length && !checkAll) {
        data.checkAll = true;
      }
    }
    let total = 0;
    dataSource.forEach((item) => {
      if (selectedRowKeys.includes(item.id)) {
        total += item[orderMap[item.type].prop];
      }
    });
    data.selectedRowKeys = selectedRowKeys;
    data.total = total;
    this.setData(data);
  },

  /**
   * 全选/取消全选
   */
  bindCheckAll() {
    const { dataSource, orderMap, checkAll } = this.data;
    const data = {
      checkAll: !checkAll,
    };
    if (checkAll) {
      // 取消全选
      data.selectedRowKeys = [];
      data.total = 0;
    } else {
      // 全选
      let total = 0;
      data.selectedRowKeys = dataSource.map((item) => {
        total += item[orderMap[item.type].prop];
        return item.id;
      });
      data.total = total;
    }
    this.setData(data);
  },

  /**
   * 删除
   */
  bindDeleteClick() {
    const { userInfo } = app.globalData;
    const { selectedRowKeys, checkAll, dataSource } = this.data;
    if (selectedRowKeys.length === 0) {
      wx.showToast({
        title: "请先选择订单",
        icon: "none",
      });
      return;
    }
    const orderList = dataSource.filter((item) => !selectedRowKeys.includes(item.id));
    const data = {
      dataSource: orderList,
      selectedRowKeys: [],
    };
    if (checkAll) {
      data.checkAll = false;
    }
    this.setData(data);
    wx.setStorageSync(`${userInfo.id}-orderList`, JSON.stringify(orderList));
  },

  /**
   * 结算
   */
  bindPayClick() {
    const { dataSource, selectedRowKeys, checkAll, total, submitting } = this.data;
    const { token } = app.globalData;

    if (submitting) {
      return;
    }

    if (selectedRowKeys.length === 0) {
      wx.showToast({
        title: "请先选择订单",
        icon: "none",
      });
      return;
    }

    this.getUserInfo({ token }, (userInfo) => {
      app.globalData.userInfo = userInfo;
      if (userInfo.balance - total >= 0) {
        const subscribeList = [];
        const orderList = []; // 剩余订单
        dataSource.forEach((item) => {
          if (selectedRowKeys.includes(item.id)) {
            subscribeList.push({
              userId: item.id,
              type: item.type,
            });
          } else {
            orderList.push(item);
          }
        });

        const params = {
          token,
          subscribeList,
        };

        this.batchSubscribe(params, () => {
          this.getUserInfo({ token }, (userInfo) => {
            app.globalData.userInfo = userInfo;
          });

          if (orderList.length > 0) {
            wx.setStorageSync(`${userInfo.id}-orderList`, JSON.stringify(orderList));
          } else {
            wx.removeStorageSync(`${userInfo.id}-orderList`);
          }

          const data = { dataSource: orderList, selectedRowKeys: [] };

          if (checkAll) {
            data.checkAll = !checkAll;
          }
          this.setData(data);

          wx.navigateTo({ url: "/pages/tips/index?type=success&title=订阅成功" });
        });
      } else {
        wx.showToast({
          title: "余额不足，请充值",
          icon: "none",
        });
      }
    });
  },

  /**
   * 获取数据
   */
  getDataSource() {
    const { userInfo } = app.globalData;
    let orderList = wx.getStorageSync(`${userInfo.id}-orderList`);
    if (orderList) {
      this.setData({ dataSource: JSON.parse(orderList) });
    }
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
