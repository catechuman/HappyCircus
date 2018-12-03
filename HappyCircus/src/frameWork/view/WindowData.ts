namespace fish {
    export enum WindowState {
        Close = -1,
        Loading,
        Prepare,
        open
    }

    export class WindowData {
        public id:string = '';
        public typeClass:any;
        public manualCloseOnly:boolean;
        public modal:number = 0.75;
        public modalClickHide:boolean;
        public data:any;
        public level:number;
        public parent:egret.DisplayObjectContainer;
        public state:WindowState;
        public resGroup:string;
        public skinUrl:string;
        public mFullList:string[];
        public openList:eui.ArrayCollection;
        public groupId:string = '';
        public groupCatche:any = {};
        public tabId:string;
        public closeCbList:any[];
        public openCbList:any[];
        private mInstance:IWindow;

        constructor(id:string, typeClass:any, modal:number, modalClickHide:boolean = true, manualCloseOnly:boolean = false, skinUrl:string = null, resGroup?:string, windowLevel:number = 1) {
            this.id = id;
            this.typeClass = typeClass;
            this.manualCloseOnly = manualCloseOnly;
            this.resGroup = resGroup;
            this.skinUrl = skinUrl;
            this.modal = modal;
            this.level = windowLevel;
            this.modalClickHide = modalClickHide;
            this.state = WindowState.Close;
            this.closeCbList = [];
            this.openCbList = [];
        }

        public get instance():IWindow {
            if(this.mInstance == null) {
                this.mInstance = new this.typeClass();
            }
            if('dataProvider' in this.mInstance && this.fullList) {
                (this.mInstance as IWindowGroup).dataProbider = this.openList;
            }
            return this.mInstance;
        }

        public get fullList():string[] {
            return this.mFullList;
        }

        public set fullList(value:string[]) {
            this.mFullList = value;
            this.openList = new eui.ArrayCollection();
        }

        public get isOpen():boolean {
            return this.state == WindowState.open;
        }

        public get isLoading():boolean {
            return this.state == WindowState.Loading;
        }

        public get isActive():boolean {
            return this.state > WindowState.Close;
        }

    }
}