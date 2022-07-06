Component({
  data: {
      active: 0,
      show: true,
      list: [
          {
              pagePath: "/pages/index/index",
              text: "资讯",
              icon: 'smile',
          },
          {
              pagePath: "/pages/classify/classify",
              text: "植物识别",
              icon: 'enlarge'
          },
          {
              pagePath: "/pages/map/map",
              text: "路线规划",
              icon: 'fire'
          },
          {
              pagePath: "/pages/user/user",
              text: "个人中心",
              icon: 'gem'
          },
      ]
  },
  methods: {
      /**
       * 用户点击导航栏触发
       * @param {*} event 
       */
      onChange(event) {
          // event.detail 的值为当前选中项的索引
          this.setData({
              active: event.detail 
          });
          //页面切换
          wx.switchTab({
              url: this.data.list[event.detail].pagePath,
          });
      },

      init() {
          let token = wx.getStorageSync('token');
          if (!token) {
              this.setData({
                  show: false
              });
          } else {
              this.setData({
                  show: true
              });
          }
          const page = getCurrentPages().pop();
          this.setData({
      　      active: this.data.list.findIndex(item => item.pagePath === `/${page.route}`)
          });
      }
  }
});