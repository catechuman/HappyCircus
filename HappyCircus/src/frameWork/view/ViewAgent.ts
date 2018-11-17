namespace fish {
    export class ViewAgent {
        private mIsInitialized: boolean;
        private mResource:ViewResource;
        private mViewId: string;
        private mIsOpen: boolean;
        private mData: any;
        // private mEffect:IWindowEffect;

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

        private partMap:PartInfoMap;
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
        public callSafe(func:Function, thisObj?:any, args?:any):void {
            if(this.isInitialized) {
                func.call(thisObj, args);
            }else {
                func = thisObj ? func.bind(thisObj) : func;
                this.initFuncList.push({func:func, args:args});
            }
        }

        //加载皮肤和解析皮肤文件
        public load(skinUrl?:string, resGroup?:string, onComplete?:Function, onError?:Function, thisObj?:any):boolean {
            let instance:ViewAgent = this;
            if(this.isInitialized) {
                if(onComplete!= null) {
                    onComplete.call(thisObj, instance.view);
                }
                return false;
            }
            let onLoadError = ()=>{
                if(onError != null) {
                    onError.call(thisObj, instance.view);
                }
            }

            let initSkin = (clazz:any = null, url:string = null)=>{
                if(clazz != null) {
                    instance.partMap = PartInfoMap.getInfoMap(url);
                    instance.view.skinName = clazz;
                } else if(url) {
                    onLoadError();
                    // fish.Log.warn('not found skinClass:' + url);
                    return;
                }

                if(!instance.mIsInitialized) {
                    instance.mIsInitialized = true;
                    instance.onViewInit();
                    if(instance.partMap) {
                        instance.partMap.init(instance.view);
                    }

                    egret .callLater(()=>{
                        if(onComplete != null) {
                            onComplete.call(thisObj, instance.view);
                        }
                        if(instance.initFuncList.length > 0) {
                            for(const func of instance.initFuncList) {
                                func.func(func.args);
                            }

                            instance.initFuncList = [];
                        }
                    }, this);
                }
            }

            let loadSkin = ()=>{
                if(skinUrl != null && instance.view.skinName != null) {
                    ResourceManager.loadSkin(skinUrl, initSkin, instance);
                } else {
                    initSkin();
                }
            }

            if(resGroup != null) {
                this.resource = ResourceManager.loadViewResource(resGroup, loadSkin)
            }
        }

        public get isInitialized():boolean {
            return this.mIsInitialized;
        }

        //资源
        public get resource():ViewResource {
            return this.mResource;
        }

        public set resource(value:ViewResource) {
            this.mResource = value;
        }

    }

    class PartInfoMap {
        private partMap:any = {};
        private isInited:boolean;
        private static skinPartMap:any = {};
        public addPart(name:string):void {
            let info = this.partMap[name];
            if(!info) {
                this.partMap[name] = new PartInfo(name);
            }
        }

        public getPart(name:string):PartInfo {
            return this.partMap[name];
        }

        public init(view:eui.Component):void {
            if(this.isInited) return;
            for(const key in this.partMap) {
                let info:PartInfo = this.partMap[key];
                info.init(view[key]);
            }
        }

        public static getInfoMap(skin:string):PartInfoMap {
            let map = this.skinPartMap[skin];
            if(map == null) {
                map = this.skinPartMap[skin] = new PartInfoMap();
            }
            return map;
        }
    }

    class PartInfo {
        public name:string = '';
        public x:number = 0;
        public y:number = 0;
        public scaleX:number = 1;
        public scaleY:number = 1;
        public anchorOffsetX:number = 0;
        public anchorOffsetY:number = 0;
        public aipha:number = 1;
        public rotation:number = 0;
        public visible:boolean = true;
        public top:number = 0;
        public bottom:number = 0;
        public left:number = 0;
        public right:number = 0;
        public notchFit:boolean = false;
        constructor(name:string) {
            this.name = name;
        }

        public init(display:any):void {
            for(let key in this) {
                if(display[key]) {
                    this[key] = display[key];
                }
            }

            // if(SystemManager.isNotchMobile && this.notchFit) {
            //     display.y += 60;
            //     display.to += 60;
            // }

        }

    }
}

