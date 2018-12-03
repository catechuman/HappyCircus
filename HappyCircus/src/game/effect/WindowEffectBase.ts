
namespace fish {
	export class WindowEffectBase extends EffectBase implements IWindowEffect {
		public target: egret.DisplayObject;
		constructor() {
			super();
		}

		//显示效果
		public show(target: egret.DisplayObject, onComplete: Function, args: any = null): void {
			this.init(target);
		}

		//隐藏效果
		public hide(target: egret.DisplayObject, onComplete: Function, args: any = null): void {
			this.init(target);
		}
	}
}