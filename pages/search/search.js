const app=getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    result:[]

    
  },
  onSearch: function (e){
   wx.request({
     url: app.globalData.url +'/news/findPage',
     method:'POST',
     header:{
			'Authorization':wx.getStorageSync('token')
    },
    data:{
      pageNumber:1,
      pageSize:100,
      queryString:e.detail
    },
    success:(res)=>{
      console.log(res)
        this.setData({
          result:res.data.rows
        })
        console.log(this.data.result)
    }
   })
    
  },
  
  To_item: function (e) {
    console.log("e",e.currentTarget.id);
    // console.log(JSON.stringify(this.data))
    var items=this.data.result[e.currentTarget.id];
    wx.navigateTo({
      url: '/pages/detail/detail?id='+e.currentTarget.id,
      success: function(res) {
        // 通过eventChannel向被打开页面传送数据
        
        res.eventChannel.emit('acceptDataFromOpenerPage', { data:items})
      },
  
      onSearch: function(e){
        console.log(e.detail)
      },
      
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})