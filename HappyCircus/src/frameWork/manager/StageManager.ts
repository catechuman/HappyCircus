namespace fish {
    export enum Layer {
        BG,
        SCREEN,
        FACEUI,
        WINDOW,
        TOP,
        TIP
    }

    export class StageManager {
        public static stage: egret.Stage;
        public static scaleFactor: number = 1;
        private static root: egret.DisplayObjectContainer;
        private static resizeTimer: number;
        private static resizeListeners: Array<Object> = [];
        public static stageOffHeight: number = 0;

        public static initialize(stage: egret.Stage, root: egret.DisplayObjectContainer): void {
            StageManager.stage = stage;
            StageManager.root = root;

            StageManager.stage.scaleMode = egret.StageScaleMode.FIXED_WIDTH;
            window.onresize = () => {
                StageManager.resizeTimer = egret.setTimeout(this.onStageResize, this, 300);
            }

            window.onerror = (errorMsg, scriptUrl, lineNum) => {
                Log.log(errorMsg, scriptUrl, lineNum);
            }

            let index = 0;
            for (let enumMember in Layer) {
                if (isNaN(Number(enumMember))) {
                    this.addLayer(index, enumMember);
                    index++;
                }
            }

            this.onStageResize();
        }

        //尺寸发生变化时执行回调
        private static onStageResize(): void {
            this.resizeTimer = null;
            for (let i = 0; i < StageManager.resizeListeners.length; i++) {
                let obj: Object = StageManager.resizeListeners[i];
                let func: Function = obj['func'];
                let thisObj: any = obj['thisObj'];
                func.call(thisObj);
            }
        }

        //添加初始化层级
        private static addLayer(layerIndex: number = -1, layerName: string): void {
            layerIndex = layerIndex == -1 ? this.root.numChildren : layerIndex;
            let layer = <egret.Sprite>this.root.addChildAt(new egret.Sprite(), layerIndex);
            layer.touchChildren = true;
            layer.touchEnabled = false;
            layer.name = layerName;
        }

        public static getLayer(layerName: any): egret.DisplayObjectContainer {
            layerName = typeof (layerName) == "number" ? Layer[layerName] : layerName;
            let layer: egret.DisplayObject = this.root.getChildByName(layerName);
            if (layer)
                return <egret.DisplayObjectContainer><any>layer;

            return null;
        }

        //舞台的宽
        public static get stageWidth(): number {
            return StageManager.stage.stageWidth;
        }

        //舞台的高
        public static get stageHeight(): number {
            return StageManager.stage.stageHeight;
        }

        /**
         * 添加自适应回调函数
         * @param listener 回调函数
         * @param thisObj 
         */
        public static addResizeListener(listener: Function, thisObj: any): void {
            if (this.getCallBackIndex(StageManager.resizeListeners, listener, thisObj) == -1) {
                StageManager.resizeListeners.push({ func: listener, thisObj: thisObj });
                listener.call(thisObj);
            }
        }

        //移除自适应回调函数
        public static removeResizeListener(listener: Function, thisObj: any): void {
            let index: number = this.getCallBackIndex(StageManager.resizeListeners, listener, thisObj);
            if (index != -1) {
                StageManager.resizeListeners.splice(index, 1);
            }
        }

        private static getCallBackIndex(callBacks: Array<any>, callBack: Function, thisObj: any): number {
            let len: number = callBacks.length;
            for (let i = 0; i < len; i++) {
                let callObj: Object = callBacks[i];
                if (callObj['func'] === callBack && callObj['thisObj'] === thisObj) {
                    return i;
                }
            }
            return -1;
        }

        /**
         * 创建全局的黑色遮罩
         * @param onTouch 点击遮罩的回调
         * @param thisObj 
         * @param modalColor 
         * @param modalAlpha 
         */
        public static createStageModalBlocker(onTouch: Function = null, thisObj: any = null, modalColor: number = 0x0, modalAlpha: number = 0.75): StageModalBlocker {
            let blocker: StageModalBlocker = new StageModalBlocker(onTouch, thisObj, modalColor, modalAlpha);
            return blocker;
        }
    }

    //舞台全屏遮罩
    export class StageModalBlocker extends eui.Image {
        private onTouch: Function;
        private thisObj: any;
        private static texture: egret.RenderTexture;
        constructor(onTouch: Function = null, thisObj: any = null, modalColor: number = 0x0, modalAlpha: number = 0.75) {
            super();
            this.onTouch = onTouch;
            thisObj = thisObj;
            this.alpha = modalAlpha;

            this.touchEnabled = true;
            this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBlockTouch, this);
            StageManager.addResizeListener(this.onResize, this);
            this.initTexture();
        }

        private initTexture(): void {
            this.source = '';
        }

        public removeFromParent(dispose: boolean = false): void {
            if (this.parent) {
                this.parent.removeChild(this);
            }
        }

        private onResize(): void {
            this.width = StageManager.stageWidth;
            this.height = StageManager.stageHeight;
        }

        private onBlockTouch(): void {
            if (this.onTouch) {
                this.onTouch.call(this.thisObj);
            }
        }
    }
}