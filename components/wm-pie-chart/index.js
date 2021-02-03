// components/wm-pie-chart/index.js
Component({
  options: {
    addGlobalClass: true,
  },

  /**
   * 组件的属性列表
   */
  properties: {
    // 只能传百分比
    value: {
      type: Number,
      value: 0,
    },
    // 大小
    size: {
      type: Number,
      value: 0,
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
    _value: 0,
    isAdd: true,
    leftAngle: 0,
    rightAngle: 0,
    percentage: 0,
  },

  /**
   * 数据监听器
   */
  observers: {
    value(val) {
      const { _value } = this.data;
      if (val !== _value) {
        const result = (360 * val) / 100;
        let leftAngle = 0;
        let rightAngle = 0;
        if (result > 180) {
          rightAngle = 180;
          leftAngle = result - 180;
        } else {
          rightAngle = result;
        }
        this.setData({
          _value: val,
          percentage: val,
          isAdd: val > _value,
          leftAngle,
          rightAngle,
        });
      }
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {},
});
