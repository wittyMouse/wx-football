// components/wm-checkbox/index.js
const app = getApp();

Component({
  options: {
    addGlobalClass: true,
  },

  // relations: {
  //   "../wm-checkbox-group/index": {
  //     type: "ancestor",
  //   },
  // },

  /**
   * 组件的属性列表
   */
  properties: {
    checked: {
      type: Boolean,
      value: false,
    },
    label: {
      type: String,
      value: "",
    },
    value: {
      type: String,
      value: "",
    },
    extClass: {
      type: String,
      value: "",
    },
    extStyle: {
      type: String,
      value: "",
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    _checked: false,
    assetsURL: app.globalData.assetsURL,
  },

  /**
   * 数据监听器
   */
  observers: {
    checked(val) {
      this.setData({ _checked: val });
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * radio 点击事件
     */
    bindClick() {
      const { value } = this.data;
      this.triggerEvent("click", { value }, { bubbles: true, composed: true });
    },

    /**
     * 更新数据
     * @param {*} propName
     * @param {*} value
     */
    updateData(propName, value) {
      this.setData({ [propName]: value });
    },
  },
});
