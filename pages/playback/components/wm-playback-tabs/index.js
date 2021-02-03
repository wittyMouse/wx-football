// pages/playback/components/wm-playback-tabs/index.js
Component({
  options: {
    addGlobalClass: true,
  },

  /**
   * 组件的属性列表
   */
  properties: {
    // 当前激活 tab 面板的 key
    activeKey: {
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
  data: {
    children: [],
    tabList: [],
    currentIndex: 0,
  },

  /**
   * 数据监听器
   */
  observers: {
    activeKey(key) {
      const { children, tabList } = this.data;
      children.forEach((target) => {
        target.updateData("activeKey", key);
      });
      tabList.some((item, index) => {
        if (item.key === key) {
          this.setData({ currentIndex: index });
          return true;
        }
        return false;
      });
    },
  },

  /**
   * 组件间关系定义
   */
  relations: {
    "../wm-playback-tab-pane/index": {
      type: "child", // 关联的目标节点应为子节点
      linked: function (target) {
        // 每次有custom-li被插入时执行，target是该节点实例对象，触发在该节点attached生命周期之后
        // console.log(target);
        const { activeKey } = this.data;
        target.updateData("activeKey", activeKey);
        const { key, tab } = target.data;
        const { itemImage, itemName, itemDesc } = tab;
        const { children, tabList } = this.data;
        children.push(target);
        tabList.push({
          key,
          itemName,
          itemDesc,
          itemImage,
        });
        this.setData({ children, tabList });
      },
      linkChanged: function (target) {
        // 每次有custom-li被移动后执行，target是该节点实例对象，触发在该节点moved生命周期之后
      },
      unlinked: function (target) {
        // 每次有custom-li被移除时执行，target是该节点实例对象，触发在该节点detached生命周期之后
        const { key } = target.data;
        const { children, tabList } = this.data;
        let idx = -1;
        tabList.some((item, index) => {
          if (item.key === key) {
            idx = index;
            return true;
          }
          return false;
        });
        if (idx > -1) {
          tabList.splice(idx, 1);
          children.splice(idx, 1);
        }
        this.setData({
          children,
          tabList,
        });
      },
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 切换 activeKey
     * @param {*} e
     */
    bindClick(e) {
      const { key } = e.currentTarget.dataset;
      const { activeKey } = this.data;
      if (activeKey !== key) {
        this.triggerEvent("change", { activeKey: key });
      }
    },
  },
});
