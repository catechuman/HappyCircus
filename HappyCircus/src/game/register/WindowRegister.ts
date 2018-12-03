
namespace game {
    export class WindowRegister extends fish.Register {

        /*注册窗口*/
        /**
         * 
         * @param windowId 
         * @param type 
         * @param skinPath 皮肤地址
         * @param resGroup 需要预加载的资源组
         * @param manualCloseOnly 只能手动关闭(不会被其他window关闭)
         * @param modalAutoHide 点击模态是否自动关闭
         * @param hasModal 是否有模态
         * @param windowLevel 窗口级别
         */
        public registWindow<T extends fish.IWindow>(windowId: string, type: new () => T, skinPath: string = null, resGroup?: string, manualCloseOnly: boolean = false, modalAutoHide: boolean = false, modal: number = 0.75, windowLevel: number = 1): fish.WindowData {
            var skinUrl: string = skinPath ? ResourcePath.getSkinRes(skinPath) : null;
            return fish.WindowManager.registWindow(windowId, type, skinUrl, resGroup, modal, modalAutoHide, manualCloseOnly, windowLevel);
        }

        /*注册窗口组*/
        // public registGroupBig(windowId: string, viewList: Array<string>, resGroup?: string, modal: number = 0.75, manualCloseOnly: boolean = false, windowLevel: number = 1, groupType?: any): fish.WindowData {
        //     var skinUrl: string = ResourcePath.getSkinRes("common/WindowGroupBigSkin");
        //     let winData: fish.WindowData = fish.WindowManager.registWindow(windowId, groupType || WindowGroupBig, skinUrl, resGroup, modal, false, manualCloseOnly, windowLevel);
        //     winData.fullList = viewList;
        //     return winData;
        // }

        // public registGroupSmall(windowId: string, viewList: Array<string>, resGroup?: string, modal: number = 0.75, manualCloseOnly: boolean = false, windowLevel: number = 1, groupType?: any): fish.WindowData {
        //     var skinUrl: string = ResourcePath.getSkinRes("common/WindowGroupSmallSkin");
        //     let winData: fish.WindowData = fish.WindowManager.registWindow(windowId, groupType || WindowGroupSmall, skinUrl, resGroup, modal, false, manualCloseOnly, windowLevel);
        //     winData.fullList = viewList;
        //     return winData;
        // }

        public initialize(): void {
            // this.registWindow(WindowType.WINDOW_TEST, TestWindow, "test/testWindowSkin", "testTexture");
        }
    }
}