// pages/home/components/wm-tabs/index.js
const app = getApp();

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
    assetsURL: app.globalData.assetsURL,
    children: [],
    tabList: [],
    targetProps: [],
    currentIndex: 0,
    // 任务列表
    // taskList: [],
    updateCurrentIndex: false,
  },

  /**
   * 数据监听器
   */
  observers: {
    activeKey(key) {
      // console.log("observers-activeKey: ", key);

      // 忘记为什么要写这个逻辑了
      // const { children, tabList } = this.data;
      // children.forEach((target) => {
      //   target.updateData("activeKey", key);
      // });

      const { tabList } = this.data;
      if (tabList.length === 0) {
        this.setData({ updateCurrentIndex: true });
      } else {
        for (let i = 0; i < tabList.length; i++) {
          if (tabList[i].key === key) {
            this.setData({ currentIndex: i });
            break;
          }
        }
      }
    },
  },

  /**
   * 组件间关系定义
   */
  relations: {
    "../wm-tab-item/index": {
      type: "child", // 关联的目标节点应为子节点
      linked: function (target) {
        // 每次有custom-li被插入时执行，target是该节点实例对象，触发在该节点attached生命周期之后
        // console.log(target);

        // 忘记为什么要写这个逻辑了
        // const { activeKey } = this.data;
        // target.updateData("activeKey", activeKey);

        const { updateCurrentIndex, activeKey } = this.data;
        const { key, tab } = target.data;
        const { children, tabList } = this.data;
        const data = {};
        if (updateCurrentIndex && activeKey === key) {
          data.updateCurrentIndex = false;
          data.currentIndex = children.length;
        }
        children.push(target);
        tabList.push({ key, tab });
        data.children = children;
        data.tabList = tabList;
        this.setData(data);
      },
      linkChanged: function (target) {
        // 每次有custom-li被移动后执行，target是该节点实例对象，触发在该节点moved生命周期之后
      },
      unlinked: function (target) {
        // 每次有custom-li被移除时执行，target是该节点实例对象，触发在该节点detached生命周期之后
        const { key } = target.data;
        const { children, tabList } = this.data;
        const idx = tabList.findIndex((item) => item.key === key);
        if (idx > -1) {
          tabList.splice(idx, 1);
          children.splice(idx, 1);
          const data = {
            children,
            tabList,
          };
          if (idx !== 0) {
            data.activeKey = children[idx].data.key;
            data.currentIndex = idx - 1;
          } else {
            data.activeKey = "";
            data.currentIndex = 0;
          }
          this.setData(data);
        }
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

    /**
     * 下标图片加载完毕
     */
    bindImageLoad() {
      const that = this;
      const query = wx.createSelectorQuery().in(this);
      query.selectAll(".ant-tabs-nav-item").boundingClientRect();
      query.exec((res) => {
        that.setData({ targetProps: res[0] });
      });
    },
  },
});
