const instance = require("./request");

/**
 * 获取 openId
 * @param {*} data
 */
const requestOpenId = (data) => {
  return instance.request({
    url: "/api/member/getOpenid",
    method: "post",
    data,
  });
};

/**
 * 获取验证码
 * @param {*} params
 */
const requestCaptcha = (params) => {
  const { timestamp } = params;
  return instance.request({
    url: `/sys/randomImage/${timestamp}`,
    method: "get",
    header: {
      "content-type": "application/x-www-form-urlencoded",
    },
  });
};

/**
 * 账号登录
 * @param {*} data
 */
const requestLogin = (data) => {
  return instance.request({
    url: "/api/member/login",
    method: "post",
    data,
  });
};

/**
 * 获取会员信息
 * @param {*} data
 */
const requestUserInfo = (data) => {
  return instance.request({
    url: "/api/member/getMemberInfo",
    method: "post",
    data,
  });
};

/**
 * 退出登录
 * @param {*} data
 */
const requestLogout = (data) => {
  return instance.request({
    url: "/api/member/logout",
    method: "post",
    data,
  });
};

/**
 * 注册
 * @param {*} data
 */
const requestRegister = (data) => {
  return instance.request({
    url: "/api/member/register",
    method: "post",
    data,
  });
};

/**
 * 修改会员信息
 * @param {*} data
 */
const requestModify = (data) => {
  return instance.request({
    url: "/api/member/updatePassword",
    method: "post",
    data,
  });
};

/**
 * 获取文章分类列表
 * @param {*} data
 */
const requestArticleList = (data) => {
  return instance.request({
    url: "/api/member/articleListByColumn",
    method: "post",
    data,
  });
};

/**
 * 胜率榜
 * @param data
 */
const requestRankingList = (data) => {
  return instance.request({
    url: "/api/member/winningList",
    method: "post",
    data,
  });
};

/**
 * 胜场榜（图表）
 * @param data
 */
const requestRankingChart = (data) => {
  return instance.request({
    url: "/api/member/winningCountList",
    method: "post",
    data,
  });
};

/**
 * 根据部门 Id 获取用户信息
 * @param data
 */
const requestAuthorInfoList = (data) => {
  return instance.request({
    url: "/api/member/selectUserByDepartId",
    method: "post",
    data,
  });
};

/**
 * 根据发布人获取文章分页列表
 * @param data
 */
const requestArticleListByAuthor = (data) => {
  return instance.request({
    url: "/api/member/articleListByPage",
    method: "post",
    data,
  });
};

/**
 * 获取发布会员详细信息
 * @param data
 */
const requestAuthorInfo = (data) => {
  return instance.request({
    url: "/api/member/getUserInfo",
    method: "post",
    data,
  });
};

/**
 * 根据发布人获取至尊推荐分页列表
 * @param data
 */
const requestRecommendList = (data) => {
  return instance.request({
    url: "/api/member/marketingListByPage",
    method: "post",
    data,
  });
};

/**
 * 至尊推介订购
 * @param data
 */
const requestSubscribe = (data) => {
  return instance.request({
    url: "/api/member/subscribe",
    method: "post",
    data,
  });
};

/**
 * 至尊推介订购批量下单
 * @param data
 */
const requestBatchSubscribe = (data) => {
  return instance.request({
    url: "/api/member/subscribeBatch",
    method: "post",
    data,
  });
};

/**
 * 最新发布
 * @param data
 */
const requestLatestArticleList = (data) => {
  return instance.request({
    url: "/api/member/latestArticleList",
    method: "post",
    data,
  });
};

/**
 * 获取文章详情
 * @param data
 */
const requestArticleDetail = (data) => {
  return instance.request({
    url: "/api/member/getArticleInfo",
    method: "post",
    data,
  });
};

/**
 * 获取重大利好数据
 * @param data
 */
const requestBestNews = (data) => {
  return instance.request({
    url: "/api/member/getPageConfigById",
    method: "post",
    data,
    // header: {
    //   "content-type": "application/x-www-form-urlencoded",
    // },
  });
};

/**
 * 文章购买
 * @param data
 */
const requestBuyArticle = (data) => {
  return instance.request({
    url: "/api/member/buyArticle",
    method: "post",
    data,
  });
};

/**
 * 录音回放列表
 * @param data
 */
const requestRecordList = (data) => {
  return instance.request({
    url: "/api/member/findRecordList",
    method: "post",
    data,
  });
};

/**
 * 获取签到配置
 * @param data
 */
const requestCheckInConfig = (data) => {
  return instance.request({
    url: "/api/member/signInConfigList",
    method: "post",
    data,
  });
};

/**
 * 签到
 * @param data
 */
const requestCheckIn = (data) => {
  return instance.request({
    url: "/api/member/checkIn",
    method: "post",
    data,
  });
};

/**
 * 签到信息
 * @param data
 */
const requestCheckInInfo = (data) => {
  return instance.request({
    url: "/api/member/checkInInfo",
    method: "post",
    data,
  });
};

/**
 * 获取充值赠送配置列表
 * @param data
 */
const requestPriceList = (data) => {
  return instance.request({
    url: "/api/member/donateConfigList",
    method: "post",
    data,
  });
};

/**
 * 发起支付
 * @param data
 */
const requestCreateOrder = (data) => {
  return instance.request({
    url: "/api/member/createOrderByJs",
    method: "post",
    data,
  });
};

/**
 * 充值与消费记录（所有流水账记录）
 * @param data
 */
const requestAmountChangeList = (data) => {
  return instance.request({
    url: "/api/member/amountChangeListByPage",
    method: "post",
    data,
  });
};

/**
 * 批量删除账变记录
 * @param data
 */
const requestDeleteAmountChange = (data) => {
  return instance.request({
    url: "/api/member/batchDeleteAmountChange",
    method: "post",
    data,
  });
};

/**
 * 至尊推介订购（记录）
 * @param data
 */
const requestSubscribeRecordList = (data) => {
  return instance.request({
    url: "/api/member/subscribeRecordListByPage",
    method: "post",
    data,
  });
};

/**
 * 批量删除至尊订阅记录
 * @param data
 */
const requestDeleteSubscribeRecord = (data) => {
  return instance.request({
    url: "/api/member/batchDeleteBuyRecord",
    method: "post",
    data,
  });
};

/**
 * 最新线报推介（记录）
 * @param data
 */
const requestBuyRecordList = (data) => {
  return instance.request({
    url: "/api/member/buyRecordListByPage",
    method: "post",
    data,
  });
};

/**
 * 批量删除文章购买记录
 * @param data
 */
const requestDeleteBuyRecord = (data) => {
  return instance.request({
    url: "/api/member/batchDeleteBuyRecord",
    method: "post",
    data,
  });
};

/**
 * 获取广告配置信息
 * @param data
 */
const requestAdConfigInfo = (data) => {
  return instance.request({
    url: "/api/member/getAdConfigInfo",
    method: "post",
    data,
  });
};

/**
 * 发送短信验证码
 * @param data
 */
const requestPhoneCode = (data) => {
  return instance.request({
    url: "/sys/getPhoneCode",
    method: "post",
    data,
  });
};

module.exports = {
  requestOpenId,
  requestCaptcha,
  requestLogin,
  requestUserInfo,
  requestLogout,
  requestRegister,
  requestModify,
  requestArticleList,
  requestRankingList,
  requestRankingChart,
  requestAuthorInfoList,
  requestArticleListByAuthor,
  requestAuthorInfo,
  requestRecommendList,
  requestSubscribe,
  requestBatchSubscribe,
  requestLatestArticleList,
  requestArticleDetail,
  requestBestNews,
  requestBuyArticle,
  requestRecordList,
  requestCheckInConfig,
  requestCheckIn,
  requestCheckInInfo,
  requestPriceList,
  requestCreateOrder,
  requestAmountChangeList,
  requestDeleteAmountChange,
  requestSubscribeRecordList,
  requestDeleteSubscribeRecord,
  requestBuyRecordList,
  requestDeleteBuyRecord,
  requestAdConfigInfo,
  requestPhoneCode,
};
