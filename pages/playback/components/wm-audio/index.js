// pages/playback/components/wm-audio/index.js
const app = getApp();

// inner: 内部音频; background: 背景音频
const model = "inner";
// 内部音频 iOS 支持格式
const innerAudioiOSSupport = ["m4a", "wav", "mp3", "aac", "aiff", "caf"];
// 内部音频 Android 支持格式
const innerAudioAndroidSupport = [
  "flac",
  "m4a",
  "ogg",
  "ape",
  "amr",
  "wma",
  "wav",
  "mp3",
  "mp4",
  "aac",
];
// 背景音频 支持格式
const backgroundAudioSupport = ["m4a", "aac", "mp3", "wav"];

Component({
  options: {
    addGlobalClass: true,
  },

  /**
   * 组件的属性列表
   */
  properties: {
    // 是否显示
    show: {
      type: Boolean,
      value: false,
    },
    // 音频标题
    title: {
      type: String,
      value: "",
    },
    // 音频资源的地址
    src: {
      type: String,
      value: "",
    },
    // 外部样式类
    extClass: {
      type: String,
      value: "",
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    windowWidth: app.globalData.systemInfo.windowWidth,
    assetsURL: app.globalData.assetsURL,

    // iOS 设备
    isiOS: false,
    // Android 设备
    isAndroid: false,

    // 创建内部 audio 上下文 InnerAudioContext 对象
    innerAudioContext: null,

    // 获取全局唯一的背景音频管理器
    backgroundAudioManager: null,

    // 开始滑动
    touchstart: false,

    // 记录鼠标位置
    page: {
      x: 0,
      y: 0,
    },

    // 当前是否暂停或停止
    paused: true,

    // 进度条长度
    trackWidth: 0,

    // 音频长度
    duration: 0,

    // 当前音频的播放位置
    currentTime: 0,
  },

  /**
   * 数据监听器
   */
  observers: {
    src(val) {
      const { innerAudioContext, backgroundAudioManager } = this.data;
      if (val) {
        switch (model) {
          case "inner":
            innerAudioContext.src = val;
            break;
          case "background":
            backgroundAudioManager.src = val;
            break;
        }
      }
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 音频控制器点击事件
     * @param {*} e
     */
    bindControlClick(e) {
      const { target } = e.currentTarget.dataset;
      const { innerAudioContext, backgroundAudioManager } = this.data;
      switch (target) {
        case "prev":
          // 上一首
          this.triggerEvent("change", { target: "prev" });
          break;
        case "play":
          // 播放
          switch (model) {
            case "inner":
              innerAudioContext.play();
              break;
            case "background":
              backgroundAudioManager.play();
              break;
          }
          break;
        case "pause":
          // 暂停
          switch (model) {
            case "inner":
              innerAudioContext.pause();
              break;
            case "background":
              backgroundAudioManager.pause();
              break;
          }
          break;
        case "next":
          // 下一首
          this.triggerEvent("change", { target: "next" });
          break;
      }
    },

    /**
     * 点击进度条
     * @param {*} e
     */
    handleSliderClick(e) {
      // console.log(e);
      const { pageX } = e.touches[0];
      const { windowWidth, duration, innerAudioContext, backgroundAudioManager } = this.data;
      const seek = (duration * pageX) / windowWidth;
      switch (model) {
        case "inner":
          innerAudioContext.seek(seek);
          break;
        case "background":
          backgroundAudioManager.seek(seek);
          break;
      }
      this.setData({ trackWidth: pageX });
    },

    /**
     * 进度控制器滑动开始
     * @param {*} e
     */
    handleTouchStart(e) {
      const { pageX } = e.touches[0];
      this.setData({
        touchstart: true,
        ["page.x"]: pageX,
      });
    },

    /**
     * 进度控制器滑动
     * @param {*} e
     */
    handleTouchMove(e) {
      // console.log(e);
      const { trackWidth, touchstart, page } = this.data;
      if (!touchstart) {
        return;
      }
      const { systemInfo } = app.globalData;
      const { pageX } = e.touches[0];
      const touchWidth = pageX - page.x;
      // console.log(touchWidth);
      let _trackWidth = trackWidth + touchWidth;
      if (_trackWidth < 0) {
        _trackWidth = 0;
      } else if (_trackWidth > systemInfo.windowWidth) {
        _trackWidth = systemInfo.windowWidth;
      }
      this.setData({
        ["page.x"]: pageX,
        trackWidth: _trackWidth,
      });
    },

    /**
     * 进度控制器滑动结束
     */
    handleTouchEnd() {
      const { page, windowWidth, duration, innerAudioContext, backgroundAudioManager } = this.data;
      const seek = duration * (page.x / windowWidth);
      switch (model) {
        case "inner":
          innerAudioContext.seek(seek);
          break;
        case "background":
          backgroundAudioManager.seek(seek);
          break;
      }
      this.setData({ touchstart: false });
    },

    /**
     * 音频组件初始化
     */
    audioInit() {
      const { systemInfo } = app.globalData;
      const data = {};
      if (systemInfo && systemInfo.system) {
        systemInfo.system.indexOf("iOS") > -1 && (data.isiOS = true);
        systemInfo.system.indexOf("Android") > -1 && (data.isAndroid = true);
      }

      let innerAudioContext = null;
      let backgroundAudioManager = null;
      switch (model) {
        case "inner":
          innerAudioContext = wx.createInnerAudioContext();
          innerAudioContext.onCanplay(() => {
            innerAudioContext.play();
            const id = setInterval(() => {
              const duration = innerAudioContext.duration;
              if (duration) {
                this.setData({ duration });
                clearInterval(id);
              }
            }, 1);
          });

          innerAudioContext.onPlay(() => {
            const { paused } = this.data;
            if (paused) {
              this.setData({
                paused: false,
              });
            }
          });

          innerAudioContext.onPause(() => {
            const { paused } = this.data;
            if (!paused) {
              this.setData({
                paused: true,
              });
            }
          });

          innerAudioContext.onStop(() => {
            const { paused } = this.data;
            if (!paused) {
              this.setData({
                paused: true,
              });
            }
          });

          innerAudioContext.onTimeUpdate(() => {
            const { currentTime, duration, touchstart, windowWidth } = this.data;
            const _currentTime = innerAudioContext.currentTime;
            const data = {};
            if (_currentTime - currentTime > 1) {
              const trackWidth = (windowWidth * _currentTime) / duration;
              data.currentTime = Math.floor(_currentTime);
              if (!touchstart) {
                data.trackWidth = trackWidth;
              }
              this.setData(data);
            }
          });

          data.innerAudioContext = innerAudioContext;
          break;
        case "background":
          backgroundAudioManager = wx.getBackgroundAudioManager();
          data.backgroundAudioManager = backgroundAudioManager;
          break;
      }
      this.setData(data);
    },

    /**
     * 音频组件销毁
     */
    audioDestroyed() {
      const { innerAudioContext } = this.data;
      const data = {};
      switch (model) {
        case "inner":
          innerAudioContext.offCanplay();
          innerAudioContext.offPlay();
          innerAudioContext.offPause();
          innerAudioContext.offStop();
          innerAudioContext.offTimeUpdate();
          innerAudioContext.destroy();
          data.innerAudioContext = null;
          break;
        case "background":
          data.backgroundAudioManager = null;
          break;
      }
      this.setData(data);
    },
  },

  /**
   * 组件生命周期声明对象
   */
  lifetimes: {
    /**
     * 在组件实例进入页面节点树时执行
     */
    attached() {
      this.audioInit();
    },

    /**
     * 在组件实例被从页面节点树移除时执行
     */
    detached() {
      this.audioDestroyed();
    },
  },
});
