namespace fish {
    export class ResourceManager {
        private static viewResMap: any = {};
        private static resMap: any = {};
        private static resDisposeBlackMap: string[] = [];//资源自动释放黑名单
        public static dragonFactory = new dragonBones.EgretFactory();
        public static resourceRoot: string;

        public static loadViewResource(resGroupName: string, onComplete: Function = null, onError?: Function, thisObj?: any): ViewResource {
            let res: ViewResource = ResourceManager.getViewResource(resGroupName);
            if (res == null) {
                res = new ViewResource(resGroupName);
                ResourceManager.viewResMap[resGroupName] = res;
            }
            res.load(onComplete, onError, thisObj);
            return res;
        }

        public static getViewResource(resGroupName: string): ViewResource {
            return this.viewResMap[resGroupName];
        }

        //获取图集资源
        public static getSheet(nameOrUrl: string): SheetData {
            let res = this.getResource(nameOrUrl);
            return res ? res as SheetData :null;
        }

        public static getResource(nameOrUrl:string):any {
            let res:any = RES.getRes(nameOrUrl);
            return res;
        }

        //加载资源组
        public static loadGroup(groupName:string, priority:number = 0, onComplete?:Function, onError?:Function, thisObj?:any):void {
            RES.loadGroup(groupName, priority).then(()=>{
                onComplete && onComplete.call(thisObj);
            }, (reason)=>{
                egret.error('group loadererro name = ' + groupName);
                onError && onError.call(thisObj);
            });
        }

        //加载皮肤文件
        public static loadSkin(url:string, onComplete?:(clazz:any, url:string)=>void, thisObj:any = null):void {
            EXML.load(url, onComplete, thisObj);
        }
    }
}