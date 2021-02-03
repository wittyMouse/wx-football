// pages/user-center/record/index.js
const api = require("../../../api/index");
const util = require("../../../utils/util");
const app = getApp();

const typeList = ["充值", "购买文章", "至尊推荐"];

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

    typeList,

    // 页面数据
    pageData: {
      recharge: {
        title: "充值与消费记录",
        fn: "requestAmountChangeList",
        delete: "requestDeleteAmountChange",
      },
      journal: {
        title: "所有流水账记录",
        fn: "requestAmountChangeList",
        delete: "requestDeleteAmountChange",
      },
      recommend: {
        title: "王牌推介订购记录",
        fn: "requestSubscribeRecordList",
        delete: "requestDeleteSubscribeRecord",
      },
      clue: {
        title: "贴士专区订购记录",
        fn: "requestBuyRecordList",
        delete: "requestDeleteBuyRecord",
      },
    },

    // 当前显示页面
    target: "",

    // 选中项的 key 数组
    selectedRowKeys: [],
    // 全选
    checkAll: false,

    // 分页参数
    pagination: {
      pageNo: 1,
      pageSize: 10,
      pages: 0,
      total: 0,
    },

    // 数据加载状态
    showLoading: false,
    // 没有数据
    showNoData: false,
    // 加载更多数据
    showMoreLoading: false,
    // 没有更多数据
    showNoMore: false,
    // 数据项
    columns: [],
    // 数据源
    dataSource: [],

    // 用户信息
    userInfo: {},
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
   * 动到底部/右边时触发
   */
  bindScrollToLower() {
    const { showNoData, showNoMore, dataSource, pagination, target } = this.data;
    const { pageNo, pageSize } = pagination;
    const { token } = app.globalData;
    const { pageData } = this.data;
    if (showNoData || showNoMore) {
      return;
    }

    const params = {
      pageNo: pageNo + 1,
      pageSize,
      token,
    };

    this.setData({ showMoreLoading: true });
    api[pageData[target].fn](params)
      .then((res) => {
        if (res.code === 0) {
          const { current, size, pages, total, records } = res.result;
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
        } else {
          wx.showToast({
            title: res.message,
            icon: "none",
          });
        }
      })
      .finally(() => {
        this.setData({ showMoreLoading: false });
      });
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
   * 点击多选框
   * @param {*} e
   */
  bindCheckClick(e) {
    // console.log(e);
    const { value } = e.detail;
    const { selectedRowKeys, dataSource, checkAll } = this.data;
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
    data.selectedRowKeys = selectedRowKeys;
    this.setData(data);
  },

  /**
   * 全选/取消全选
   */
  bindCheckAll() {
    const { dataSource, checkAll } = this.data;
    const data = {
      checkAll: !checkAll,
    };
    if (checkAll) {
      // 取消全选
      data.selectedRowKeys = [];
    } else {
      // 全选
      data.selectedRowKeys = dataSource.map((item) => item.id);
    }
    this.setData(data);
  },

  /**
   * 删除
   */
  bindDeleteClick() {
    const { token } = app.globalData;
    const { target, pageData, selectedRowKeys, checkAll } = this.data;
    if (selectedRowKeys.length === 0) {
      wx.showToast({
        title: "请先选择记录",
        icon: "none",
      });
      return;
    }
    const params = {
      ids: selectedRowKeys,
      token,
    };
    this.setData({ deleteLoading: true });
    api[pageData[target].delete](params)
      .then((res) => {
        if (res.code === 0) {
          const data = {
            scrollTop: 0,
            selectedRowKeys: [],
          };
          if (checkAll) {
            data.checkAll = false;
          }
          this.setData(data);
          this.getDataSource(target);
        } else {
          wx.showToast({
            title: res.message,
            icon: "none",
          });
        }
      })
      .finally(() => {
        this.setData({ deleteLoading: false });
      });
  },

  /**
   * 获取数据源
   */
  getDataSource(target) {
    const { token } = app.globalData;
    const { pageData } = this.data;
    const params = {
      pageNo: 1,
      pageSize: 10,
      token,
    };

    this.setData({ showLoading: true, showNoData: false, showNoMore: false });
    api[pageData[target].fn](params)
      .then((res) => {
        if (res.code === 0) {
          const { current, size, pages, total, records } = res.result;
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
        } else {
          wx.showToast({
            title: res.message,
            icon: "none",
          });
        }
      })
      .finally(() => {
        this.setData({ showLoading: false });
      });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { target } = options;
    const { systemInfo, userInfo } = app.globalData;
    const adjustPosition = util.compareVersion(systemInfo.SDKVersion, "2.7.0") === -1;
    this.setData({ adjustPosition, route: this.route, target, userInfo });
    this.getDataSource(target);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const that = this;
    const query = wx.createSelectorQuery();
    query
      .select(".record-bottom-bar")
      .boundingClientRect()
      .exec(function (res) {
        // console.log(res);
        // that.setData({
        //   pageHeight: res[0].top,
        // });
      });
  },

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
