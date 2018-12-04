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

        /**
        * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
        * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
        */
        public static createBitmapByName(name: string): egret.Bitmap {
            let result = new egret.Bitmap();
            let texture: egret.Texture = RES.getRes(name);
            result.texture = texture;
            return result;
        }
    }
}