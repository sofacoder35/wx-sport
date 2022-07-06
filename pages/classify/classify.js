const app = getApp()
var that = ''
Page({
  data: {
     isShow:false,
     image:'/image/test.png',
     token:'',
     result:[],
     imageUrl:''
  },
  //选择图片按钮
  imgSelect(){
    this.setData({
      isShow:false
    })
    wx.chooseImage({
      count: 1,
      sizeType:['original', 'compressed'],
      sourceType:['album', 'camera'],
      success:(res)=>{
        const tempFilePaths = res.tempFilePaths[0]
        this.setData({
          image:tempFilePaths
        })
        wx.uploadFile({
          url: app.globalData.url+'/tool/upload',    
          filePath: tempFilePaths,
          name: 'file',
          header:{
            'Authorization':wx.getStorageSync('token'),
            "Content-Type": "multipart/form-data"
          },
          success:(res)=>{
            console.log(res)
            this.setData({
              imageUrl:res.data
            })
          }
        })
      },
    })
  },
  //植物识别
  plant(){
    if(!this.data.imageUrl){
      this.setData({
        isShow:true
      })
      return
    }
    this.getResult()
  },
  //获取识别结果
  getResult(){
   wx.request({
     url:app.globalData.url+'/baidu/baiduClassify',
     method:'POST',
     data:{
      image:this.data.imageUrl
     },
     header:{
       'Content-Type':'application/x-www-form-urlencoded',
       'Authorization':wx.getStorageSync('token')
     },
     success:(res)=>{
       console.log(res.data.data.result);
       this.setData({
         result:that.resultFilter(res.data.data.result)
         
       })
  
     },
     complete:()=>{
       wx.hideLoading()
     }
   })
  },
  //result结果过滤
  resultFilter(arr){
    arr.forEach((item)=>{
      item.score = (item.score.toFixed(4)*100).toFixed(2) + '%'
    })
    return arr
    },
    save(){
        var jsonObj = JSON.parse(this.data.imageUrl);
        var url=jsonObj['data']
        wx.request({
          url: app.globalData.url+'/collection/insert',
          method:'POST',
          header:{
            'Authorization':wx.getStorageSync('token')
          },
          data:{
            userId:wx.getStorageSync("userId"),
            plantName:this.data.result[0].name,
            url:url
          },
          success:(res)=>{
            console.log(res.data.message)
            wx.showToast({
              title: res.data.message,
              icon: 'success',
              duration: 2000
            })
          }
        })
    },
   // 生命周期函数--监听页面加载
  onLoad: function (options) {
   that = this
  },
  onShow: function () {
	
		this.getTabBar().init();
	},
})