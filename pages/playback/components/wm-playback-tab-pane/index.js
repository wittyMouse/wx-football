// pages/playback/components/wm-playback-tab-pane/index.js
Component({
  options: {
    addGlobalClass: true,
  },

  /**
   * 组件的属性列表
   */
  properties: {
    // 选项卡数据
    tab: {
      type: Object,
      optionalTypes: [String],
      value: {},
    },
    // 对应 activeKey
    key: {
      type: String,
      optionalTypes: [Number],
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
  data: {},

  /**
   * 组件间关系定义
   */
  relations: {
    "../wm-playback-tabs/index": {
      type: "parent", // 关联的目标节点应为子节点
      linked: function (target) {
        // 每次有custom-li被插入时执行，target是该节点实例对象，触发在该节点attached生命周期之后
      },
      linkChanged: function (target) {
        // 每次有custom-li被移动后执行，target是该节点实例对象，触发在该节点moved生命周期之后
      },
      unlinked: function (target) {
        // 每次有custom-li被移除时执行，target是该节点实例对象，触发在该节点detached生命周期之后
      },
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    updateData(propName, value) {
      this.setData({ [propName]: value });
    },
  },
});
