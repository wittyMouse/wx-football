//app.js
App({
  onLaunch: function () {
    // // 获取用户信息
    // wx.getSetting({
    //   success: (res) => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: (res) => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo;

    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res);
    //           }
    //         },
    //       });
    //     }
    //   },
    // });

    // todo
    // try {
    //   const res = wx.getSystemInfoSync();
    //   // console.log(res);
    //   const { statusBarHeight, windowWidth, windowHeight } = res;
    //   const navigationBarHeight = statusBarHeight + (100 * windowWidth) / 750;
    //   const tabBarHeight = (98 * windowWidth) / 750;
    //   // const pageTop = statusBarHeight + navigationBarHeight;
    //   const pageTop = statusBarHeight + (80 * windowWidth) / 750;
    //   const pageHeight = windowHeight - pageTop;
    //   const pageHeightWidthTabBar = pageHeight - (86 * windowWidth) / 750;
    //   this.globalData.systemInfo = res;
    //   this.globalData.statusBarHeight = statusBarHeight;
    //   this.globalData.navigationBarHeight = navigationBarHeight;
    //   this.globalData.tabBarHeight = tabBarHeight;
    //   this.globalData.pageTop = pageTop;
    //   this.globalData.pageHeight = pageHeight;
    //   this.globalData.pageHeightWidthTabBar = pageHeightWidthTabBar;
    // } catch (e) {
    //   console.error(e);
    // }

    // 存储设备信息
    wx.getSystemInfo({
      success: (res) => {
        // console.log(res);
        const { statusBarHeight, windowWidth, windowHeight } = res;
        const navigationBarHeight = statusBarHeight + (100 * windowWidth) / 750;
        // const tabBarHeight = (98 * windowWidth) / 750;
        const tabBarHeight = (86 * windowWidth) / 750;
        // const pageTop = statusBarHeight + navigationBarHeight;
        const pageTop = statusBarHeight + (80 * windowWidth) / 750;
        const pageHeight = windowHeight - pageTop;
        const pageHeightWidthTabBar = pageHeight - tabBarHeight;
        this.globalData.systemInfo = res;
        this.globalData.statusBarHeight = statusBarHeight;
        this.globalData.navigationBarHeight = navigationBarHeight;
        this.globalData.tabBarHeight = tabBarHeight;
        this.globalData.pageTop = pageTop;
        this.globalData.pageHeight = pageHeight;
        this.globalData.pageHeightWidthTabBar = pageHeightWidthTabBar;
      },
      fail: (err) => {
        console.error(err);
      },
    });

    // 登录
    wx.login({
      success: ({ code }) => {
        // console.log(code);
        wx.request({
          url: `${this.globalData.baseURL}/api/member/getOpenid`,
          method: "post",
          data: { code, env: "mini-program" },
          success: (res) => {
            // console.log(res);
            if (res.data.code === 0) {
              console.log(res.data.result);
              this.globalData.openId = res.data.result;
            }
          },
        });
      },
    });
  },
  globalData: {
    // 本地环境
    // baseURL: "http://192.168.196.55:8080/df",
    // 测试环境
    // baseURL: "https://www.df1668.com/df_test",
    // 生产环境
    baseURL: "https://www.df1668.com/df",
    // 静态资源地址
    assetsURL: "https://www.df1668.com/images",
    // 设备信息
    systemInfo: {},
    // 用户信息
    userInfo: {},
    // 用户 token
    token: "",
    // 用户的 openId
    openId: "",
    // 状态栏的高度
    statusBarHeight: 0,
    // 导航栏高度
    navigationBarHeight: 0,
    // 底部 tabBar 高度
    tabBarHeight: 0,
    // 页面距顶部距离
    pageTop: 0,
    // 页面高度
    pageHeight: 0,
    // 显示 tabBar 时的页面高度
    pageHeightWidthTabBar: 0,
  },
});
