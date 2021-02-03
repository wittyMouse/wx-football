// components/wm-radio-group/index.js
Component({
  options: {
    addGlobalClass: true,
  },

  behaviors: ["wx://form-field"],

  /**
   * 组件间关系
   */
  relations: {
    "../wm-radio/index": {
      type: "descendant",
      linked(target) {
        // console.log("relations.linked: ", target);
        const { children } = this.data;
        children.push(target);
        this.setData({ children });
      },
      linkChanged() {},
      unlinked(target) {
        const { children } = this.data;
        const { value } = target.data;
        const idx = children.findIndex((item) => item.data.value === value);
        if (idx > -1) {
          children.splice(idx, 1);
          this.setData({ children });
        }
      },
    },
  },

  /**
   * 组件的属性列表
   */
  properties: {
    name: {
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
    children: [],
  },

  /**
   * 数据监听器
   */
  observers: {
    value(val) {
      // console.log("observers.value: ", val);
      const { children } = this.data;
      if (children.length > 0) {
        children.forEach((item) => {
          if (item.data.value === val) {
            item.updateData("_checked", true);
          } else {
            item.updateData("_checked", false);
          }
        });
      }
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    bindClick(e) {
      const { value } = e.detail;
      this.triggerEvent("change", { value });
    },
  },

  /**
   * 组件生命周期
   */
  lifetimes: {
    ready() {
      // console.log("ready");
      const { children, value } = this.data;
      if (children.length > 0) {
        children.forEach((item) => {
          if (item.data.value === value) {
            item.updateData("_checked", true);
          } else {
            item.updateData("_checked", false);
          }
        });
      }
    },
    detached() {
      this.setData({ children: [] });
    },
  },
});
