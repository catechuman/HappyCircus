
namespace fish {
    export class WindowManager {
        private static navigator: WindowNavigator;

        public static initialize(navigator: WindowNavigator): void {
            this.navigator = navigator;
        }

        public static registWindow<T extends fish.IWindow>(windowId: string, typeClass: new () => T, skinUrl: string = null, resGroup?: string, modal: number = 0.75, modalClickHide: boolean = true, manualCloseOnly: boolean = false, windowLevel: number = 1): WindowData {
            if (this.navigator == null) {
                this.navigator = new WindowNavigator(StageManager.getLayer(Layer.WINDOW));
            }
            return WindowManager.navigator.registWindow(windowId, typeClass, skinUrl, resGroup, modal, modalClickHide, manualCloseOnly, windowLevel);
        }

        public static unRegisterWindow(windowId: string = ''): void {
            WindowManager.navigator.unRegistWindow(windowId);
        }

        public static hasWindow(windowId: string = ''): boolean {
            return WindowManager.navigator.hasWindow(windowId);
        }

        public static getWindow(windowId: string = ''): IWindow {
            return WindowManager.navigator.getWindow(windowId);
        }

        //获取窗口数据
        public static getWindowData(windowId: string): WindowData {
            return WindowManager.navigator.getWindowData(windowId);
        }

        public static get currentWindow(): string {
            return WindowManager.navigator.currentWindow;
        }

        public static set currentWindow(value: string) {
            WindowManager.navigator.currentWindow = value;
        }

        //参数传递可考虑设计成...args或数组，便于与配置数据适应
        public static showWindow(windowId: string, data: any = null, parent: egret.DisplayObjectContainer = null, onOpen?: Function, onClose?: Function, thisObj?: any, windowLevel: number = -1): void {
            WindowManager.navigator.showWindow(windowId, data, parent, onOpen, onClose, thisObj, windowLevel);
        }

        //隐藏窗口
        public static hideWindow(windowId: string = '', onClose?: Function, thisObj?: any, dispose: boolean = false, withEffect: boolean = true): void {
            WindowManager.navigator.hideWindow(windowId, onClose, thisObj, dispose, withEffect);
        }

        //隐藏所有活动窗口
        public static hideAllWindow(withEffect: boolean = true): void {
            WindowManager.navigator.hideAllWindow(withEffect);
        }

        //是否打开
        public static isOpen(windowId: string = ''): boolean {
            return WindowManager.navigator.isOpen(windowId);
        }

        //是否处于活动状态
        public static isActive(windowId: string = ''): boolean {
            return WindowManager.navigator.isActive(windowId);
        }

        //是否有模态
        public static get isModaling(): boolean {
            return WindowManager.navigator.isModaling;
        }

        //是否处于加载状态
        public static get isLoading(): boolean {
            return WindowManager.navigator.isLoading;
        }

        // public static setOpenList(funcTypeList: Array<any>, update: boolean=false): void {
        //     WindowManager.navigator.setOpenList(funcTypeList, update);
        // }

        // public static setOpen(windowId: string, open: boolean): void {
        //     WindowManager.navigator.setOpen(windowId, open);
        // }
    }
}