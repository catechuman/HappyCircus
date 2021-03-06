
namespace fish {
	export class ScreenManager {
		private static navigator: WindowNavigator;

		public static initialize(navigator: WindowNavigator): void {
			this.navigator = navigator;
		}

		public static registScreen<T extends fish.IScreen>(screenId: string, screen: new () => T, skinUrl: string = null, resGroup?: string): WindowData {
			if (ScreenManager.navigator == null) {
				ScreenManager.navigator = new WindowNavigator(StageManager.getLayer(Layer.SCREEN));
			}

			return ScreenManager.navigator.registWindow(screenId, screen, skinUrl, resGroup, -1, false);
		}

		public static unRegisterScreen(screenId: string): void {
			ScreenManager.navigator.unRegistWindow(screenId);
		}

		public static hasScreen(screenId: string): boolean {
			return ScreenManager.navigator.hasWindow(screenId);
		}

		public static getScreen(screenId: string): IScreen {
			return <IScreen><any>(ScreenManager.navigator.getWindow(screenId));
		}

		//获取窗口数据
		public static getScreenData(screenId: string): WindowData {
			return ScreenManager.navigator.getWindowData(screenId);
		}

		public static get currentScreen(): string {
			return ScreenManager.navigator.currentWindow;
		}

		public static set currentScreen(value: string) {
			ScreenManager.navigator.currentWindow = value;
		}

		//返回上一个
		public static back(): boolean {
			return ScreenManager.navigator.back();
		}

		public static showScreen(screenId: string, data: any = null, onOpen?: Function, onClose?: Function, thisObj?: any, ): void {
			ScreenManager.navigator.showWindow(screenId, data, null, onOpen, onClose, thisObj);
		}

		public static hideScreen(screenId: string, onClose?: Function, thisObj?: any, dispose: boolean = false, withEffect: boolean = true): void {
			ScreenManager.navigator.hideWindow(screenId, onClose, thisObj, dispose, withEffect);
		}

		//隐藏所有活动场景
		public static hideAllScreen(withEffect: boolean = true): void {
			ScreenManager.navigator.hideAllWindow(withEffect);
		}

		public static isOpen(screenId: string): boolean {
			return ScreenManager.navigator.isOpen(screenId);
		}

		public static isActive(screenId: string): boolean {
			return ScreenManager.navigator.isActive(screenId);
		}

		//是否处于加载状态
		public static get isLoading(): boolean {
			return ScreenManager.navigator.isLoading;
		}
	}
}