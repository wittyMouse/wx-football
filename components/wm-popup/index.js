// components/wm-popup/index.js
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
    // 遮罩显示状态
    mask: {
      type: Boolean,
      value: true,
    },
    safe: {
      type: Boolean,
      value: true,
    },
    // 外部样式类
    extClass: {
      type: String,
      value: "",
    },
    // 外部样式
    extStyle: {
      type: String,
      value: "",
    },
    // 遮罩外部样式类
    maskClass: {
      type: String,
      value: "",
    },
    // 遮罩外部样式
    maskStyle: {
      type: String,
      value: "",
    },
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 空方法，阻止滑动穿透
     */
    noop() {},

    /**
     * 点击遮罩层
     */
    bindMaskClick() {
      this.triggerEvent("close");
    },

    /**
     * popup 动画结束
     */
    bindTransitionend() {
      if (!this.data.show) {
        this.triggerEvent("closed");
      }
    },
  },
});
