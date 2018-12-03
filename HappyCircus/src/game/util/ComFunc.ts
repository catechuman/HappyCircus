namespace game {
    export class ComFunc {
        //判断是否是特殊机型-》在小游戏中带有头帘的手机，例如iPhone X
        public static checkMobileDevice(): void {
           if (!fish.SystemManager.isWxGame) return;//H5上
           wx.getSystemInfo(function (data) {
               WxSystemInfo = data;//系统信息;
               fish.Log.fatal("mobileSystem info:", WxSystemInfo);
               fish.SystemManager.isNotchMobile = (data.screenHeight / data.screenWidth) > 2;
               fish.Log.log("isNotchMobile--->>>> ", fish.SystemManager.isNotchMobile);
           });
       }
   }
}