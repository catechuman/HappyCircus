namespace fish {
    export class ItemRender extends eui.ItemRenderer {
        private agent: ViewAgent;
        constructor(autoDisposeRes: boolean = true, autoResetSkin: boolean = true) {
            super();
            this.agent = new ViewAgent(this, autoDisposeRes, autoResetSkin, this.onInit, this.onData, this.onOpen, this.onClose);
        }

        public load(skinUrl: string, resGroup?: string, onComplete?: Function, onError?: Function, thisObj?: any): void {
            this.agent.load(skinUrl, resGroup, onComplete, onError, thisObj);
        }

        protected dataChanged() {
            this.callSafe(() => {
                this.resetSkinParts();
                super.dataChanged();
                this.agent.data = this.data;
                this.invalidateState();
            });
        }

        public get isInitialized():boolean {
            return this.agent.isInitialized;
        }

        /**
        * 初始化【每个窗口有且仅有一次】
        */
        protected onInit(): void {

        }

        /** 设置数据*/
        protected onData(): void {

        }

        /** 打开node*/
        protected onOpen(): void {

        }

        /** 关闭node*/
        protected onClose(): void {

        }

        //安全执行
        public callSafe(func:Function, thisObj?:any, args?:any):void {
            this.agent.callSafe(func, thisObj, args);
        }
        //重置皮肤状态
        public resetSkinParts():void {
            this.agent.resetSkinParts();
        }
        public partAdded(partName:string, instance:any):void {
            super.partAdded(partName, instance);
            this.agent.partAdded(partName, instance);
        }

        public addClick(target:egret.EventDispatcher, callBack:Function, thisObj:any):void {
            this.agent.addClick(target, callBack, thisObj);
        }

        public removeClick(target:egret.EventDispatcher, callBack:Function, thisObj:any):void {
            this.agent.removeClick(target, callBack, thisObj);
        }

        public removeFromParent(dispose:boolean = false):void {
            this.agent.removeFromParent(dispose);
        }
    }
}