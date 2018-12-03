
namespace fish {

	export class ScaleBackEffect extends WindowEffectBase {
		constructor() {
			super();

		}
		//显示效果
		public show(target: egret.DisplayObject, onComplete: Function, args: any = null): void {
			target["autoFrameRate"] = true;
			super.show(target, onComplete, args);
			target.scaleX = target.scaleY = 0.4;
			egret.Tween.get(target).to({ scaleX: 1, scaleY: 1 }, 360, egret.Ease.backOut).call(onComplete, target);
		}

		//隐藏效果
		public hide(target: egret.DisplayObject, onComplete: Function, args: any = null): void {
			egret.Tween.removeTweens(target);
			//egret.Tween.get(target).to({scaleX:0,scaleY:0,alpha:0},360,egret.Ease.backIn).call(onComplete,target);
			onComplete();
		}
	}
}