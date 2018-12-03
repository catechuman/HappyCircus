namespace fish {
    export class SystemManager {
        public static isNotchMobile: boolean = false;//是否刘海屏

        //是否微信game
        public static get isWxGame(): boolean {
            return egret.Capabilities.runtimeType == egret.RuntimeType.WXGAME;
        }

        /**是否苹果设备*/
        public static get isIOS(): boolean {
            return game.WxSystemInfo.system.indexOf(Const.IOS) != -1;
        }

        /**是否Android设备*/
        public static get isAndroid(): boolean {
            return game.WxSystemInfo.system.indexOf(Const.Android) != -1;
        }
    }
}