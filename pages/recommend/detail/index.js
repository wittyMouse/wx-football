// pages/recommend/detail/index.js
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

    authorInfoLoading: false,
    authorInfo: {},

    recommendListLoading: false,
    dataSource: [],

    // 当前选中套餐
    currentType: 0,

    // 分页参数
    pagination: {
      pageNo: 1,
      pageSize: 10,
      pages: 0,
      total: 0,
    },

    // 刷新页面
    reload: false,

    showLoading: false,
    // 没有数据
    showNoData: false,
    // 加载更多数据
    showMoreLoading: false,
    // 没有更多数据
    showNoMore: false,

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

    userInfo: {},

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
   * 根据部门 Id 获取用户信息
   * @param {*} params
   * @param {*} cb
   */
  getAuthorInfo(params, cb) {
    this.setData({ authorInfoLoading: true });
    api
      .requestAuthorInfo(params)
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
        this.setData({ authorInfoLoading: false });
      });
  },

  /**
   * 获取至尊推荐分页列表
   * @param {*} params
   * @param {*} cb
   */
  getRecommendList(params, cb, fn) {
    api
      .requestRecommendList(params)
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
        fn && fn();
      });
  },

  /**
   * 至尊推介订购
   * @param {*} params
   * @param {*} cb
   */
  subscribe(params, cb) {
    this.setData({ subscribeLoading: true });
    api
      .requestSubscribe(params)
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
        this.setData({ subscribeLoading: false });
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
   * 滚动到底部/右边时触发
   */
  bindScrollToLower() {
    const { showNoData, showNoMore, dataSource, pagination, id } = this.data;
    const { pageNo, pageSize } = pagination;
    const { token } = app.globalData;
    if (showNoData || showNoMore) {
      return;
    }

    const params = {
      pageNo: pageNo + 1,
      pageSize,
      token,
      userId: id,
    };
    this.setData({ showMoreLoading: true });
    this.getRecommendList(
      params,
      (res) => {
        const { current, size, pages, total, records } = res;
        const data = {
          pagination: {
            pageNo: current,
            pageSize: size,
            pages,
            total,
          },
          dataSource: dataSource.concat(records),
        };
        if (current === pages) {
          data.showNoMore = true;
        }
        this.setData(data);
      },
      () => {
        this.setData({ showMoreLoading: false });
      },
    );
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
   * 刷新数据
   */
  reloadData() {
    const { id } = this.data;
    const { token, userInfo } = app.globalData;
    const params = {
      pageNo: 1,
      pageSize: 10,
      token,
      userId: id,
    };
    this.setData({ scrollTop: 0, showLoading: true, showNoData: false, showNoMore: false, userInfo });
    this.getRecommendList(
      params,
      (res) => {
        const { current, size, pages, total, records } = res;
        const data = {
          pagination: {
            pageNo: current,
            pageSize: size,
            pages,
            total,
          },
          dataSource: records,
        };
        if (total === 0) {
          data.showNoData = true;
        } else if (current === pages) {
          data.showNoMore = true;
        }
        this.setData(data);
      },
      () => {
        this.setData({ showLoading: false });
      },
    );
  },

  /**
   * 登录
   */
  bindLogin() {
    this.reloadData();
  },

  /**
   * 退出
   */
  bindLogout() {
    this.reloadData();
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
   * 修改套餐
   * @param {*} e
   */
  bindTypeClick(e) {
    const { type } = e.currentTarget.dataset;
    this.setData({ currentType: type });
  },

  /**
   * 点击按钮
   * @param {*} e
   */
  bindButtonClick(e) {
    const { target } = e.currentTarget.dataset;
    const { token, userInfo } = app.globalData;
    const { id, currentType } = this.data;
    if (!token) {
      wx.showToast({
        title: "请先登录",
        icon: "none",
      });
      return;
    }

    this.getAuthorInfo({ token, userId: id }, (res) => {
      const authorInfo = res;
      this.setData({ authorInfo });
      if (res.isSubscribe) {
        wx.showToast({
          title: "王牌推介订阅还在有效期内",
          icon: "none",
        });
        return;
      }

      // 当前加车订单的数据
      const newOrder = {
        id: authorInfo.id,
        realname: authorInfo.realname,
        type: currentType,
        dayAmount: authorInfo.dayAmount,
        weekAmount: authorInfo.weekAmount,
        monthAmount: authorInfo.monthAmount,
      };
      switch (target) {
        case "buy":
          this.setData({ showTipsModal: true });
          break;
        case "car":
          // eslint-disable-next-line no-case-declarations
          let orderList = wx.getStorageSync(`${userInfo.id}-orderList`);
          if (orderList) {
            orderList = JSON.parse(orderList);
            let order = {};
            let idx = -1;
            orderList.some((item, index) => {
              if (item.id === newOrder.id) {
                order = item;
                idx = index;
                return true;
              }
              return false;
            });
            if (idx > -1) {
              if (order.type === newOrder.type) {
                wx.showToast({
                  title: "该订单已在购物车",
                  icon: "none",
                });
                return;
              } else {
                orderList[idx] = newOrder;
              }
            } else {
              orderList.push(newOrder);
            }
          } else {
            orderList = [newOrder];
          }
          wx.setStorageSync(`${userInfo.id}-orderList`, JSON.stringify(orderList));
          wx.showToast({
            title: "已添加到购物车",
            icon: "none",
          });
          break;
      }
    });
  },

  /**
   * 确认购买
   */
  bindBuyClick() {
    const { token } = app.globalData;
    const { id, currentType, userInfo } = this.data;
    this.subscribe({ token, type: currentType, userId: id }, () => {
      this.setData({ reload: true });
      this.bindTipsModalClose()

      this.getUserInfo({ token }, (res) => {
        app.globalData.userInfo = res;
      });

      let orderList = wx.getStorageSync(`${userInfo.id}-orderList`);
      if (orderList) {
        orderList = JSON.parse(orderList);
        orderList = orderList.filter((item) => item.id !== id);
        wx.setStorageSync(`${userInfo.id}-orderList`, JSON.stringify(orderList));
      }

      wx.navigateTo({ url: "/pages/tips/index?type=success&title=订阅成功" });
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
    this.setData({ adjustPosition, route: this.route, id, userInfo });

    this.getAuthorInfo({ token, userId: id }, (res) => {
      this.setData({ authorInfo: res });
    });

    const params = {
      pageNo: 1,
      pageSize: 10,
      token,
      userId: id,
    };

    this.setData({ showLoading: true });
    this.getRecommendList(
      params,
      (res) => {
        const { current, size, pages, total, records } = res;
        const data = {
          pagination: {
            pageNo: current,
            pageSize: size,
            pages,
            total,
          },
          dataSource: records,
        };
        if (total === 0) {
          data.showNoData = true;
        } else if (current === pages) {
          data.showNoMore = true;
        }
        this.setData(data);
      },
      () => {
        this.setData({ showLoading: false });
      },
    );
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const { reload } = this.data;
    if (reload) {
      this.setData({ reload: false });
      this.reloadData();
    }
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
