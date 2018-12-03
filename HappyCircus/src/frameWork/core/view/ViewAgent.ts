namespace fish {
    export class ViewAgent {
        private mIsInitialized: boolean;
        private mResource: ViewResource;
        private mViewId: string;
        private mIsOpen: boolean;
        private mData: any;
        private mEffect: IWindowEffect;

        private view: eui.Component;
        private onViewInit: Function;
        private onViewData: Function;
        private onViewOpen: Function;
        private onViewClose: Function;
        private onViewDispose: Function;
        private autoDisposeRes: boolean;
        private autoResetSkin: boolean;

        private initFuncList: any[];
        private closeFuncList: any[];
        private openFuncList: any[];

        private partMap: PartInfoMap;
        constructor(view: eui.Component, autoDisposeRes: boolean = true, autoResetSkin: boolean = true, onInit: Function, onData: Function, onOpen?: Function, onClose?: Function, onDispose?: Function) {
            this.view = view;
            this.autoDisposeRes = autoDisposeRes;
            this.autoResetSkin = autoResetSkin;

            this.onViewInit = onInit.bind(view);
            this.onViewData = onData.bind(view);
            this.onViewOpen = onOpen != null ? onOpen.bind(view) : null;
            this.onViewClose = onClose != null ? onClose.bind(view) : null;
            this.onViewDispose = onDispose != null ? onDispose.bind(view) : null;

            this.initFuncList = [];
            this.openFuncList = [];
            this.closeFuncList = [];
        }

        //保证一定是view初始化之后才会执行，不然有可能取不到一些compont
        public callSafe(func: Function, thisObj?: any, args?: any): void {
            if (this.isInitialized) {
                func.call(thisObj, args);
            } else {
                func = thisObj ? func.bind(thisObj) : func;
                this.initFuncList.push({ func: func, args: args });
            }
        }

        //加载皮肤和解析皮肤文件
        public load(skinUrl?: string, resGroup?: string, onComplete?: Function, onError?: Function, thisObj?: any): boolean {
            let instance: ViewAgent = this;
            if (this.isInitialized) {
                if (onComplete != null) {
                    onComplete.call(thisObj, instance.view);
                }
                return false;
            }
            let onLoadError = () => {
                if (onError != null) {
                    onError.call(thisObj, instance.view);
                }
            }

            let initSkin = (clazz: any = null, url: string = null) => {
                if (clazz != null) {
                    instance.partMap = PartInfoMap.getInfoMap(url);
                    instance.view.skinName = clazz;
                } else if (url) {
                    onLoadError();
                    // fish.Log.warn('not found skinClass:' + url);
                    return;
                }

                if (!instance.mIsInitialized) {
                    instance.mIsInitialized = true;
                    instance.onViewInit();
                    if (instance.partMap) {
                        instance.partMap.init(instance.view);
                    }

                    egret.callLater(() => {
                        if (onComplete != null) {
                            onComplete.call(thisObj, instance.view);
                        }
                        if (instance.initFuncList.length > 0) {
                            for (const func of instance.initFuncList) {
                                func.func(func.args);
                            }

                            instance.initFuncList = [];
                        }
                    }, this);
                }
            }

            let loadSkin = () => {
                if (skinUrl != null && instance.view.skinName != null) {
                    ResourceManager.loadSkin(skinUrl, initSkin, instance);
                } else {
                    initSkin();
                }
            }

            if (resGroup != null) {
                this.resource = ResourceManager.loadViewResource(resGroup, loadSkin);
                this.resource.autoDispose = this.autoDisposeRes;
            } else {
                loadSkin();
            }
            return true;
        }

        /**
         * show view显示界面
         * @param container 
         * @param data 
         * @param onOpenFunc 
         * @param onCloseFunc 
         * @param thisObj 
         */
        public show(container: egret.DisplayObjectContainer, data?: any, onOpenFunc: Function = null, onCloseFunc: Function = null, thisObj: any = null): boolean {
            this.resetSkinParts();
            this.data = data;
            onCloseFunc && this.closeFuncList.push(onCloseFunc.bind(thisObj));
            onOpenFunc && this.openFuncList.push(onOpenFunc.bind(thisObj));

            // no init
            if (!this.isInitialized) {
                this.callSafe(() => {
                    this.show(container, data);
                });
                return false;
            }

            let instance: ViewAgent = this;
            //show over
            let onShowComplete = () => {
                for (const func of instance.openFuncList) {
                    func.call(null, instance.view);
                }
                instance.openFuncList = [];
                instance.onViewOpen && instance.onViewOpen();
            }

            if (!this.isOpen) {
                container.addChild(this.view);
                this.mIsOpen = true;
                //effect
                if (this.mEffect) {
                    this.view.visible = false;
                    egret.callLater(() => {
                        this.view.visible = true;
                        this.mEffect.show(this.view, onShowComplete);
                    }, this);
                } else {
                    onShowComplete.call(this.view);
                }
                return true;
            }

            return false;
        }

        /**
         * hide view 关闭界面
         * @param dispose 
         * @param withEffect 
         */
        public hide(dispose: boolean = false, withEffect: boolean = true): boolean {
            if (!this.isInitialized) {
                this.callSafe(() => {
                    this.hide(dispose, withEffect);
                }, this);
                return false;
            }
            let instance: ViewAgent = this;
            let remove = () => {
                instance.removeFromParent(dispose);
                for (const func of instance.closeFuncList) {
                    func.call(null, instance.view);
                }
            }

            if (this.mIsOpen) {
                this.mIsOpen = false;
                if (this.view.parent != null) {

                    if (this.mEffect && withEffect) {
                        this.mEffect.hide(this.view, remove);
                    } else {
                        remove.call(this.view);
                    }
                }
            }
            return true;
        }

        //删除界面，同时回调所有注册的关闭函数
        public removeFromParent(dispose: boolean = false): void {
            if (this.view.parent) {
                this.view.parent.removeChild(this.view);
            }
            this.onViewClose && this.onViewClose();
            if (dispose) {
                this.dispose();
            }
        }

        //销毁
        public dispose(): void {
            this.onViewDispose && this.onViewDispose();
        }

        //屏幕居中适配
        public centerStage(): void {
            let view = this.view;
            view.width = StageManager.stageWidth;
            view.height = StageManager.stageHeight;
            view.anchorOffsetX = view.width * 0.5;
            view.anchorOffsetY = view.height * 0.5;
            view.x = view.anchorOffsetX;
            view.y = view.anchorOffsetY;
        }

        public get isInitialized(): boolean {
            return this.mIsInitialized;
        }

        //资源
        public get resource(): ViewResource {
            return this.mResource;
        }

        public set resource(value: ViewResource) {
            this.mResource = value;
        }
        //打开界面的是时候，需要重置一下皮肤文件
        public resetSkinParts(): void {
            if (this.partMap && this.autoResetSkin) {
                this.partMap.reset(this.view);
            }
        }

        public partAdded(partName: string, instance: any): void {
            instance.id = partName;
            if (this.partMap) {
                this.partMap.addPart(partName);
            }
        }

        //设置节点刘海适配--iphonex等
        public setNotchFit(element: egret.DisplayObject): void {
            element['notchFit'] = true;
        }

        //添加点击事件
        public addClick(target: egret.EventDispatcher, callBack: Function, thisObj: any): void {
            target.addEventListener(egret.TouchEvent.TOUCH_TAP, callBack, thisObj);
        }
        public removeClick(target: egret.EventDispatcher, callBack: Function, thisObj: any): void {
            target.removeEventListener(egret.TouchEvent.TOUCH_TAP, callBack, thisObj);
        }
        //set data
        public get data() {
            return this.mData;
        }
        public set data(value: any) {
            this.mData = value;
            this.callSafe(() => {
                this.onViewData();
            })
        }
        //isopen
        public get isOpen(): boolean {
            return this.mIsOpen;
        }

        //view id
        public get id(): string {
            return this.mViewId;
        }
        public set id(value: string) {
            this.mViewId = value;
        }

        //effect
        public get effect(): IWindowEffect {
            return this.mEffect;
        }
        public set effect(value: IWindowEffect) {
            this.mEffect = value;
        }

    }

    class PartInfoMap {
        private partMap: any = {};
        private isInited: boolean;
        private static skinPartMap: any = {};
        public addPart(name: string): void {
            let info = this.partMap[name];
            if (!info) {
                this.partMap[name] = new PartInfo(name);
            }
        }

        public getPart(name: string): PartInfo {
            return this.partMap[name];
        }

        public init(view: eui.Component): void {
            if (this.isInited) return;
            for (const key in this.partMap) {
                let info: PartInfo = this.partMap[key];
                info.init(view[key]);
            }
        }

        public static getInfoMap(skin: string): PartInfoMap {
            let map = this.skinPartMap[skin];
            if (map == null) {
                map = this.skinPartMap[skin] = new PartInfoMap();
            }
            return map;
        }

        public reset(view: eui.Component): void {
            if (!this.isInited) return;
            for (const key in this.partMap) {
                let info: PartInfo = this.partMap[key];
                info.reset(view[key]);
            }
        }
    }

    class PartInfo {
        public name: string = '';
        public x: number = 0;
        public y: number = 0;
        public scaleX: number = 1;
        public scaleY: number = 1;
        public anchorOffsetX: number = 0;
        public anchorOffsetY: number = 0;
        public aipha: number = 1;
        public rotation: number = 0;
        public visible: boolean = true;
        public top: number = 0;
        public bottom: number = 0;
        public left: number = 0;
        public right: number = 0;
        public notchFit: boolean = false;
        constructor(name: string) {
            this.name = name;
        }

        public init(display: any): void {
            for (let key in this) {
                if (display[key]) {
                    this[key] = display[key];
                }
            }

            if (SystemManager.isNotchMobile && this.notchFit) {
                display.y += 60;
                display.to += 60;
            }
        }
        public reset(display: any): void {
            if (display.hasBinder) return;
            if (display.anchorOffsetX == this.anchorOffsetX && display.anchorOffsetY == this.anchorOffsetY) {
                display.x = this.x;
                display.y = this.y;
            }

            for (let key in this) {
                if (key != 'x' && key != 'y') {
                    display[key] = this[key];
                }
            }
            if (SystemManager.isNotchMobile && this.notchFit) {
                display.y += 60;
                display.top += 60;
            }
        }

    }
}

