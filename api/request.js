const util = require("../utils/util");
const Promise = require("../utils/promise");
const app = getApp();

const Request = {
  // 请求配置
  defaultConfig: {
    baseURL: app.globalData.baseURL,
  },
  // 请求任务对象列表
  taskList: [],
  // 获取任务对象
  getTask(id) {
    const result = this.taskList.find((task) => task.id === id);
    return result ? result.task : "";
  },
  // 添加任务对象
  addTask(id, task) {
    this.taskList.push({
      id,
      task,
    });
  },
  // 移除任务对象
  removeTask(id) {
    const idx = this.taskList.findIndex((task) => task.id === id);
    if (idx > -1) {
      this.taskList.splice(idx, 1);
    }
  },
  request(config, taskId) {
    const _this = this;
    if (config.method.toLowerCase() === "get" && config.params) {
      config.url += util.formatQueryString(config.params);
    }
    const mergeConfig = {
      ...this.defaultConfig,
      ...config,
      url: this.defaultConfig.baseURL ? this.defaultConfig.baseURL + config.url : config.url,
    };
    const options = {};
    Object.keys(mergeConfig).forEach((key) => {
      if (key !== "baseURL" && key !== "params") {
        options[key] = mergeConfig[key];
      }
    });
    return new Promise((resolve, reject) => {
      const requestTask = wx.request({
        ...options,
        success(res) {
          if (res.statusCode > 199 && res.statusCode < 300) {
            resolve(res.data);
          } else {
            reject(res);
          }
        },
        fail(error) {
          reject(error);
        },
        complete() {
          _this.removeTask(taskId);
        },
      });
      if (taskId) {
        _this.addTask(taskId, requestTask);
      }
    });
  },
};

function create() {
  let instance = null;
  if (instance) {
    return instance;
  }

  instance = Object.create(Request);
  return instance;
}

const instance = create();

module.exports = instance;
