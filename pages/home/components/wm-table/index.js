// pages/home/components/wm-table/index.js
const app = getApp();

Component({
  options: {
    addGlobalClass: true,
  },

  /**
   * 组件的属性列表
   */
  properties: {
    columns: {
      type: Array,
      value: [],
    },
    dataSource: {
      type: Array,
      value: [],
    },
    extClass: {
      type: String,
      value: "",
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    assetsURL: app.globalData.assetsURL,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    bindClick(e) {
      // console.log(e);
      const { index } = e.currentTarget.dataset;
      const { dataSource } = this.data;
      this.triggerEvent("click", { id: dataSource[index].articleId });
    },
  },
});
