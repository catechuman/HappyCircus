namespace fish {
    export class WindowNavigator {
        private windowMap: Object = new Object();
        private windowContainer: egret.DisplayObjectContainer;
        private mWindowScaleFactor: number = 1;
        private activeWindows: Array<string>;
        private mDefaultEffectType: any;
        private windowSequence: string[];

        constructor(container: egret.DisplayObjectContainer, defaultEffectType?: any) {
            this.windowContainer = container;
            this.defaultEffectType = defaultEffectType;
            this.activeWindows = new Array<string>();
            this.windowSequence = [];

            this.modalBlocker = StageManager.createStageModalBlocker(this.onStageModeTouch, this);
        }

        //scale
        public get windowScaleFactor(): number {
            return this.mWindowScaleFactor;
        }
        public set windowScaleFactor(value: number) {
            this.mWindowScaleFactor = value;
        }
        //effec
        public get defaultEffectType(): any {
            return this.mDefaultEffectType;
        }
        public set defaultEffectType(value: any) {
            this.mDefaultEffectType = value;
        }

        /**
         * 注册view
         * @param windowId 
         * @param typeClass 
         * @param skinUrl 
         * @param resGroup 
         * @param modal 
         * @param modalClickHide 
         * @param manualCloseOnly 
         * @param windowLevel 
         */
        public registWindow<T extends IWindow>(windowId: string, typeClass: new () => T, skinUrl: string = null, resGroup?: string, modal: number = 0.75, modalClickHide: boolean = true, manualCloseOnly: boolean = false, windowLevel: number = 1): WindowData {
            if (this.windowMap[windowId] == null) {
                this.windowMap[windowId] = new WindowData(windowId, typeClass, modal, modalClickHide, manualCloseOnly, skinUrl, resGroup, windowLevel);
            }
            return this.windowMap[windowId];
        }

        //解除注册
        public unRegistWindow(windowId: string): void {
            if (windowId in this.windowMap) {
                delete this.windowMap[windowId];
            }
        }

        //检测是否存在view
        public hasWindow(windowId: string): boolean {
            return windowId in this.windowMap;
        }

        //获取view
        public getWindow(windowId: string): IWindow {
            if (!(windowId in this.windowMap)) {
                Log.error('windowNavigator 没有找到对应的id->> ', windowId);
            }
            let windowData: WindowData = this.windowMap[windowId];
            let window: IWindow = windowData.instance;
            window.id = windowId;
            if (typeof (window.effect) == 'undefined' && this.defaultEffectType) window.effect = new this.defaultEffectType();
            return window;
        }

        //获取view数据
        public getWindowData(windowId: string): WindowData {
            return this.windowMap[windowId];
        }

        //当前界面id
        public get currentWindow(): string {
            let len: number = this.activeWindows.length;
            if (len > 0) {
                return this.activeWindows[len - 1];
            }

            return '';
        }

        public set currentWindow(value: string) {
            if (value != '' && !(value in this.windowMap)) {
                Log.warn('WindowNavigator中没有找到windowId : ', value);
            }

            let instance: WindowNavigator = this;
            let index: number = 0;
            let tabId: number = 0;
            let windowData: WindowData;
            if (value == '') {
                //隐藏当前打开的窗口
                this.hideCurrentOpen(1);
            } else if (this.windowMap[value]) {
                windowData = this.windowMap[value];
                if (windowData.groupId == '') {
                    // windowData.groupId = '';
                    let realWindowId = instance.getRealWindowId(value);
                    if (value != realWindowId) {
                        windowData.groupId = realWindowId;
                        windowData.manualCloseOnly = false;//tab子窗口强制自动关闭
                    }
                }

                let openId = windowData.groupId != '' ? windowData.groupId : value;
                if (instance.isWindowGroup(openId)) {
                    if (this.isActive(openId) && windowData.parent) {
                        openId = value;
                    } else {
                        let groupWindowData: WindowData = instance.getWindowData(openId);
                        tabId = windowData.groupId != '' ? value : groupWindowData.openList.getItemAt(0);
                        if (groupWindowData.openList.getItemIndex(tabId) != -1) {
                            Log.warn('group no open : ', tabId);
                            return;
                        }
                        groupWindowData.data = tabId;
                    }
                }

                Log.log('openWindow Id = ' + value + " || openId = " + openId);
                //显示窗口
                let window: IWindow = this.getWindow(openId);
                windowData = this.windowMap[openId];
                if (!this.isActive(openId)) {
                    this.load(window);
                } else if (windowData.isOpen) {
                    window.data = windowData.data;
                    windowData.parent = null;
                }
            }
        }

        //加载
        private load(win: IWindow): void {
            let windowData = this.windowMap[win.id];
            this.activeWindows.push(win.id);
            this.changeWindowState(win, WindowState.Loading);
            win.load(windowData.skinUrl, windowData.resGroup, this.prepare.bind(this), this.close.bind(this));
        }
        private prepare(win: IWindow): void {
            let windowData = this.windowMap[win.id];
            if (windowData.state != WindowState.Close) {
                this.changeWindowState(win, WindowState.Prepare);
                //数据缓存--下次打开窗口组重新prepare
                if (windowData.groupId != '') {
                    let groupData: WindowData = this.getWindowData(windowData.groupId);
                    if (groupData.groupCatche[win.id]) {
                        this.open(win);
                        return;
                    }
                }

                win.prepare((data) => {
                    if (data) {
                        windowData.data = data;
                    }
                }, () => {
                    this.close(win);
                }, windowData.data);
            }
        }

        private open(win: IWindow): void {
            let windowData: WindowData = this.windowMap[win.id];
            if (windowData.state == WindowState.Prepare) {
                //隐藏当前最上册窗口
                if (windowData.groupId == '' || this.getWindowData(windowData.groupId).isOpen) {
                    this.hideCurrentOpen(windowData.level)
                }
                //记录历史窗口顺序
                this.windowSequence.push(win.id);//TODO: 此处可能会有问题
                //显示当前
                (<egret.DisplayObject><any>win).scaleX = (<egret.DisplayObject><any>win).scaleY = this.mWindowScaleFactor;
                win.show(windowData.parent || this.windowContainer, windowData.data, this.onOpen.bind(this), this.onClose.bind(this));
                this.changeWindowState(win, WindowState.open);
                windowData.parent = null;
            } else if (windowData.state == WindowState.open) {
                windowData.data && (win.data = windowData.data);
            }
        }

        private close(win: IWindow): void {
            this.hideWindow(win.id);

            let windowData = this.windowMap[win.id];
            if (windowData.groupId != '') {
                let groupData: WindowData = this.getWindowData(windowData.groupId);
                if (groupData.isLoading) {
                    this.hideWindow(groupData.id);
                }
            }
        }

        private onOpen(win: IWindow): void {
            let windData: WindowData = this.windowMap[win.id];
            if (windData.state != WindowState.Close) {
                Log.fatal('openview id = ' + win.id);
                let groupId = windData.groupId;
                if (groupId != '') {
                    let groupData: WindowData = this.getWindowData(groupId);
                    groupData.groupCatche[win.id] = true;
                    groupData.tabId = win.id;
                }

                for (const func of windData.openCbList) {
                    func();
                }
                windData.openCbList = [];
            }
        }

        private onClose(win: IWindow): void {
            Log.fatal('close view id = ' + win.id);
            let windowData: WindowData = this.windowMap[win.id];
            let index = this.activeWindows.indexOf(win.id);
            if (index >= 0) {
                this.activeWindows.splice(index, 1);
                if (this.isWindowGroup(win.id)) {
                    let groupData: WindowData = this.getWindowData(win.id);
                    this.hideWindow(groupData.tabId);
                    groupData.tabId = '';
                    groupData.groupCatche = {};
                }
            }
            this.changeWindowState(win, WindowState.Close);
            for (const func of windowData.closeCbList) {
                func();
            }
            windowData.closeCbList = [];
        }

        //隐藏view
        public hideWindow(windowId: string, onClose?: Function, thisObj?: any, dispose: boolean = false, withEffect: boolean = true): boolean {
            if (this.windowMap[windowId]) {
                let wData: WindowData = this.windowMap[windowId];
                onClose && this.windowMap[windowId].closeCbList.push(onClose.bind(thisObj));
                let window: IWindow = this.getWindow(windowId);
                if (wData.isOpen) {
                    window.hide(dispose, withEffect);
                } else if (wData.isActive) {
                    this.activeWindows.splice(this.activeWindows.indexOf(windowId), 1);
                    this.changeWindowState(window, WindowState.Close);
                }
                return true;
            }

            return false;
        }

        //隐藏所有激活的view
        public hideAllWindow(withEffect: boolean = true): void {
            for (let i = this.activeWindows.length - 1; i >= 0; i--) {
                this.hideWindow(this.activeWindows[i], null, null, false, withEffect);
            }
            this.windowSequence = [];
        }

        //更改视图的状态
        private changeWindowState(window: IWindow, state: WindowState): void {
            let wdata = this.windowMap[window.id];
            if (wdata && wdata.state != state) {
                wdata.state = state;
                this.checkWindowModal();
                this.onStateChanged(window, state);
            }
        }

        protected onStateChanged(window: IWindow, state: WindowState): void {
            Log.log("WindowState changed ID:" + window.id + ",state:" + state);
        }

        //隐藏当前打开的窗口
        private hideCurrentOpen(windowLevel?: number): string {
            let count: number = this.activeWindows.length;
            if (count > 0) {
                for (let i = count - 1; i >= 0; i--) {
                    let windowId = this.activeWindows[i];
                    let windowData: WindowData = this.windowMap[windowId];
                    let levelChecked: boolean = windowLevel == undefined || windowData.level == windowLevel;
                    if (levelChecked && windowData.isOpen && !windowData.manualCloseOnly) {
                        this.hideWindow(windowId);
                        return windowId;
                    }
                }
            }
            return '';
        }

        //是否已打开
        public isOpen(windowId: string): boolean {
            if (this.windowMap[windowId]) {
                return (<WindowData>this.windowMap[windowId]).isOpen;
            }
            return false;
        }
        //是否处于激活状态
        public isActive(windowId: string): boolean {
            if (this.windowMap[windowId]) {
                return (<WindowData>this.windowMap[windowId]).isActive;
            }
            return false;
        }

        //是否有遮罩
        public get isModaling():boolean {
            if(this.modalBlocker.parent) {
                return true;
            }

             let windowData :WindowData;
             let acCount:number = this.activeWindows.length;
             for(let i = acCount - 1; i >= 0; i--) {
                 windowData = this.getWindowData(this.activeWindows[i]);
                 if(windowData.modal >= 0 && windowData.groupId == '') {
                     return true;
                 }
             }
             return false;
        }

        //显示view
        public showWindow(windowId:string, data:any = null, parent:egret.DisplayObjectContainer = null, onOpen?:Function, onClose?:Function, thisObj?:any, windowLevel:number = -1) {
            let windowData:WindowData = this.windowMap[windowId];
            if(windowData) {
                if(windowLevel != -1) {
                    windowData.level = windowLevel;
                }

                onOpen && windowData.openCbList.push(onOpen.bind(thisObj));
                onClose && windowData.closeCbList.push(onClose.bind(thisObj));
                windowData.data = data;
                windowData.parent = parent;
                this.currentWindow = windowId;
            }
        }

        //窗口模板------------------------------------------>>>>>>>
        private modalBlocker: egret.DisplayObject;
        private modalId: string = '';
        private checkWindowModal(): void {
            if (this.modalBlocker.parent != null) {
                this.modalBlocker.parent.removeChild(this.modalBlocker);
            }
            let activeCount: number = this.activeWindows.length;
            let windowData: WindowData;
            for (let i = activeCount - 1; i >= 0; i--) {
                let acId = this.activeWindows[i];
                windowData = this.getWindowData(acId);
                if (windowData.modal >= 0 && windowData.isOpen && windowData.groupId == '') {
                    this.modalId = acId;
                    let index: number = this.windowContainer.getChildIndex(<egret.DisplayObject><any>(this.getWindow(acId)));
                    this.modalBlocker.alpha = windowData.modal;
                    this.windowContainer.addChildAt(this.modalBlocker, Math.max(index, 0));
                    break;
                }
            }
        }

        //遮罩的点击
        private onStageModeTouch():void {
            let windowData:WindowData = this.getWindowData(this.modalId);
            if(windowData.modalClickHide && windowData.isOpen) this.hideWindow(this.modalId);
        }
        ///--------------------------------------窗口模板  ------end
        
        //是否是组窗口
        public isWindowGroup(windowId: string = ''): boolean {
            let windowData: any = this.getWindowData(windowId);
            return windowData && (windowData.fullList != null);
        }

        //获取tab窗口的真实id
        private getRealWindowId(checkWindowId: string = ''): string {
            for (let wId in this.windowMap) {
                let wData: any = this.getWindowData(wId);
                if (wData.fullList) {
                    let len = wData.fullList.length;
                    for (let i = 0; i < len; i++) {
                        let id: string = wData.fullList[i];
                        if (id == checkWindowId)
                            return wId;
                    }
                }
            }

            return checkWindowId;
        }
    }
}