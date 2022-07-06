var coors;
const app = getApp();
Page({
    data: {
        polyline:[],
        markers:[{
            latitude:'',
            longitude:'',
        }, {
            latitude:'',
            longitude:'',
        }],
        scale:13,
        distance:'0',
        time:'0'
    },
    onLoad: function (options) {
        let that2 = this;

        wx.getSystemInfo({
          success: function (res) {
            //设置map高度，根据当前设备宽高满屏显示
            that2.setData({
              view: {
                Height: res.windowHeight
              }
    
            })
    
          }
        }),
        wx.getLocation({
          success:(res)=>{
            
            this.setData({
              'markers[0].latitude':res.latitude,
              'markers[0].longitude':res.longitude
            })
          }
        })
    },
    onChangeAddress: function() {
           wx.chooseLocation({
             success: (res)=> {
        
          
              this.setData({
                'markers[1].latitude':res.latitude,
                'markers[1].longitude':res.longitude
              })
              wx.request({
                // url:'https://apis.map.qq.com/ws/direction/v1/driving/?from='+this.data.markers[0].latitude+','+this.data.markers[0].longitude+'&to='+this.data.markers[1].latitude+','+  this.data.markers[1].longitude+'&output=json&callback=cb&key='+qqMapKey,
                url: app.globalData.url+'/tool/map',
                method:'POST',
                data:{
                  fromLatitude:this.data.markers[0].latitude,
                  fromLongitude:this.data.markers[0].longitude,
                  toLatitude:this.data.markers[1].latitude,
                  toLongitude: this.data.markers[1].longitude

                },
                header:{
                  'Authorization':wx.getStorageSync('token')
                },
                success:(res)=>{
                    console.log("req",res)
                    coors = res.data.data.result.routes[0].polyline
                    for(var i=2; i< coors.length; i++) {
                        coors[i]= coors[i-2]+ coors[i]/1000000
                    }
                    // console.log(coors)
                    //划线
                    var b=[];
                    for(var i=0; i< coors.length; i=i+2) {
                        b[i/2]={
                            latitude: coors[i],longitude:coors[i+1]
                        };
                        // console.log(b[i/2])
                    }
                    this.setData({
                        polyline: [{
                            points: b,
                            color:"#FA6400",
                            width:4,
                            dottedLine:false
                        }],
                        distance:res.data.data.result.routes[0].distance,
                        time:res.data.data.result.routes[0].duration
                    })
                }
            }),

               console.log("loc",this.data.markers[1].latitude)
            },
       
            
          });

        },
    controltap(e) {
      var that = this;
      console.log("scale===" + this.data.scale)
      if (e.controlId === 1) {
        // if (this.data.scale === 13) {
        that.setData({
          scale: --this.data.scale
        })
        // }
      } else {
        //  if (this.data.scale !== 13) {
        that.setData({
          scale: ++this.data.scale
        })
        // }
      }
  
    },
    onShow: function () {
		
      this.getTabBar().init();
    },
});