namespace fish {
    export class Window extends View implements IWindow {
        public backGroundBitMap: egret.Bitmap;
        private autoCenter:boolean;
        constructor(autoDispose:boolean = true, autoCenter:boolean = true, autoResetSkin:boolean = true) {
            super(autoDispose, autoResetSkin);
            this.autoCenter = autoCenter;
            this.touchEnabled = true;
        }

        //加载皮肤和资源组
        public load(skinUrl?:string, resGroup?:string, onComplete?:Function, onProgress?:Function, thisObj?:any):boolean {
            return super.load(skinUrl, resGroup, ()=>{
                if(this.skin) {
                    StageManager.addResizeListener(()=>{
                        if(this.autoCenter) {
                            this.centerStage();
                        }
                        this.onResize();
                    }, this);
                }

                if(onComplete) onComplete.call(thisObj, this);
            }, onProgress, thisObj);
        }

        //调整窗口尺寸变化
        protected onResize():void {
        }

        public set backGround(value: any) {

            let onGetResource = (content: egret.Texture) => {
                if (this.backGroundBitMap == null) {
                    this.backGroundBitMap = new egret.Bitmap();
                    this.addChildAt(this.backGroundBitMap, 0);
                }
                this.backGroundBitMap.texture = content;
                this.validateNow();
            }
            ResourceManager.loadResource(value, onGetResource, this);
        }
    }
}