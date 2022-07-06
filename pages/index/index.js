const app = getApp();
var that = ''
import Toast from '@vant/weapp/toast/toast';
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		userInfo: {
			nickName: '',
			sex: 0,
			address: '',
			avatarUrl: '',		
		},
		result:[],
		msgCode: '',
		//是否可以点击
		disabled: false,
		token: null,
		//用户点击tabbar
		active: 0,

	},

	getPhoneNumber: function (e) {
		this.setData({
			phoneNumber: e.detail
		});
	},

	getCode: function (e) {
		this.data.msgCode = e.detail;
	},

	/**
	 * 登录
	 */
	login() {
		wx.getUserProfile({
			desc: '用于完善用户资料',
			lang: 'zh_CN',
			success: (res) => {
				//拿到用户信息
				let user = res.userInfo;
				//昵称
				let nickName = user.nickName;
				//性别
				let sex = user.gender;
				//地址
				let address = user.country + user.province + user.city;
				//头像
				let avatarUrl = user.avatarUrl;
				//用户信息
				this.data.userInfo = {
					nickName: nickName,
					sex: sex,
					address: address,
					avatarUrl: avatarUrl
				};
				//获取到用户信息后登录
				wx.login({
					success: (res) => {
						if (res.code) {
							//使用请求码发送请求
							wx.request({
								url: app.globalData.url + '/mini/login',
								data: {
									code: res.code,
                  nickName:nickName,
                  sex:sex,
                  avatar:avatarUrl,
                  address:address,
                  openId:''
								},
								method: 'POST',
								success: (loginRes) => {
									if (!loginRes.data.flag) return Toast.fail(loginRes.data.message);
									this.setData({
										token: loginRes.data.data.tokenHead + loginRes.data.data.token
									});
									console.log(loginRes)
									wx.setStorageSync('token', loginRes.data.data.tokenHead + loginRes.data.data.token);
									wx.setStorageSync('userId',loginRes.data.data.userInfo.id);
									wx.setStorageSync('userInfo', this.data.userInfo)
									wx.setStorageSync('openid', loginRes.data.data.openid)
									this.getNews();
									this.getTabBar().init();
									
   
								},
								fail: (err) => {
									console.log(err);
								}
              });
              
              
						} else {
							console.log('登录失败 --> ' + res.errMsg);
						}
					}
				});
			}
		});
	},

getNews(){
	wx.request({
		url: app.globalData.url+'/news/findAll',
		method:'POST',
		header:{
			'Authorization':wx.getStorageSync('token')
		},
		success:(res)=>{		
			// console.log(res.data.data)
				this.setData({
					result:res.data.data
				})
				// console.log("result",this.data.result)			
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
To_search:function(e){
	wx.navigateTo({
		url: '/pages/search/search'
	})

},



	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		that=this
		let token = wx.getStorageSync('token');
		if (token) {
			this.setData({
				token: token
			});
			
		}
		this.getNews();
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
		let token = wx.getStorageSync('token');
		this.setData({
			token: token
		});
		this.getTabBar().init();
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

