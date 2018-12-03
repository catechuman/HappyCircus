namespace fish {
    export class View extends eui.Component implements IView {
        private agent: ViewAgent;
        constructor(autoDisposeRes: boolean = true, autoResetSkin: boolean = true) {
            super();
            this.agent = new ViewAgent(this, autoDisposeRes, autoResetSkin, this.onInit, this.onData, this.onOpen, this.onClose, this.onDispose);
        }

        public load(skinUrl?: string, resGroup?: string, onComplete?: Function, onError?: Function, thisObj?: any): boolean {
            return this.agent.load(skinUrl, resGroup, onComplete, onError, thisObj);
        }

        public show(container: egret.DisplayObjectContainer, data?: any, onOpenFunc: Function = null, onCloseFunc: Function = null, thisObj: any = null): boolean {
            return this.agent.show(container, data, onOpenFunc, onCloseFunc, thisObj);
        }

        public hide(dispose: boolean = false, withEffect: boolean = true): boolean {
            return this.agent.hide(dispose, withEffect);
        }

        public prepare(onComplete: Function, onError: Function, data?: any): void {
            onComplete();
        }

        public centerStage(): void {
            this.agent.centerStage();
        }

        public dispose(): void {
            this.agent.dispose();
        }

        public get data(): any {
            return this.agent.data;
        }

        public set data(value: any) {
            this.agent.data = value;
        }

        public get id(): string {
            return this.agent.id;
        }

        public set id(value: string) {
            this.agent.id = value;
        }

        public get isOpen(): boolean {
            return this.agent.isOpen;
        }
        public get isInitialized(): boolean {
            return this.agent.isInitialized;
        }

        //资源
        public get resource(): ViewResource {
            return this.agent.resource;
        }
        public set resource(value: ViewResource) {
            this.agent.resource = value;
        }
        //效果
        public get effect(): IWindowEffect {
            return this.agent.effect;
        }
        public set effect(value: IWindowEffect) {
            this.agent.effect = value;
        }

        //打开一个界面需要执行的步骤
        protected onInit(): void {

        }
        protected onData(): void {

        }
        protected onOpen(): void {

        }
        protected onClose(): void {

        }
        protected onDispose(): void {

        }

        //快捷方法
        public partAdded(partName: string, instance: any): void {
            super.partAdded(partName, instance);
            this.agent.partAdded(partName, instance);
        }

        public resetSkinParts(): void {
            this.agent.resetSkinParts();
        }

        public setNotchFit(element: egret.DisplayObjectContainer): void {
            this.agent.setNotchFit(element);
        }

        public callSafe(func: Function, thisObj: any): void {
            this.agent.callSafe(func, thisObj);
        }

        public addClick(target: egret.EventDispatcher, callBack: Function, thisObj?: any): void {
            this.agent.addClick(target, callBack, thisObj);
        }
        
        public removeClick(target: egret.EventDispatcher, callBack: Function, thisObj?: any): void {
            this.agent.removeClick(target, callBack, thisObj);
        }

        public removeFromParent(dispose: boolean = false): void {
            this.agent.removeFromParent(dispose);
        }
    }
}