
namespace fish {
	export class EffectBase implements IEffect {
		public target: egret.DisplayObject;
		public initX: number;
		public initY: number;
		public autoCenter: boolean = true;
		constructor(autoCenter: boolean = true) {
			this.autoCenter = autoCenter;
		}

		//中心点锚点居中
		protected init(target: egret.DisplayObject): void {
			target["hasEffect"] = true;
			this.target = target;
			if (this.autoCenter) {
				if (this.target.width > 0 && this.target.anchorOffsetX == 0) {
					this.target.anchorOffsetX = this.target.width * 0.5;
					this.target.anchorOffsetY = this.target.height * 0.5;
					this.target.x += this.target.anchorOffsetX;
					this.target.y += this.target.anchorOffsetY;
					this.initX = this.target.x;
					this.initY = this.target.y;
				}
			}
			if (!this.hasOwnProperty("initX")) {
				this.initX = this.target.x;
				this.initY = this.target.y;
			}
		}

		//开始效果
		public start(target: egret.DisplayObject, args: any = null): void {
			this.init(target);
		}

		//停止效果
		public stop(target: egret.DisplayObject, args: any = null): void {
			this.init(target);
		}
	}
}