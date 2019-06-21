namespace fish {
    export class ResourceManager {
        private static viewResMap: any = {};
        private static resMap: any = {};
        private static resDisposeBlackMap: string[] = [];//资源自动释放黑名单
        public static dragonFactory = new dragonBones.EgretFactory();
        public static resourceRoot: string;

        public static initialize(version: string, resourceRoot: string, onComplete?: Function, onError?: Function, thisObj?: any): void {
            ResourceManager.resourceRoot = resourceRoot ? resourceRoot : '';
            RES.setMaxRetryTimes(3);//设置重试次数
            if (fish.SystemManager.isWxGame && fish.SystemManager.isIOS) {
                RES.setMaxLoadingThread(4);
            }
            //inject the custom material parser
            //注入自定义的素材解析器
            let assetAdapter = new AssetAdapter();
            egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
            egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());
            // RES.processor.map(RES.ResourceItem.TYPE_SHEET, SheetProcessor);//重写sheet加载
            let onConfigComplete = () => {
                fish.Log.fatal("ResourceManager:default.res.json load suc");
                onComplete.call(thisObj);
            }
            //加载资源配置文件
            RES.loadConfig('default.res.json', resourceRoot)
                .then(onConfigComplete, () => {
                    fish.Log.error('加载default.res.json失败了。')
                });
        }

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
            return res ? res as SheetData : null;
        }

        public static getResource(nameOrUrl: string): any {
            let res: any = RES.getRes(nameOrUrl);
            return res;
        }

        //加载资源组
        public static loadGroup(groupName: string, priority: number = 0, onComplete?: Function, onError?: Function, thisObj?: any): void {
            RES.loadGroup(groupName, priority).then(() => {
                onComplete && onComplete.call(thisObj);
            }, (reason) => {
                egret.error('group loadererro name = ' + groupName);
                onError && onError.call(thisObj);
            });
        }

        //加载皮肤文件
        public static loadSkin(url: string, onComplete?: (clazz: any, url: string) => void, thisObj: any = null): void {
            EXML.load(url, onComplete, thisObj);
        }

        //加载皮肤json文件并解析
        public static loadSkinJson(url: string, onComplete?: Function, onError?: Function, thisObj: any = null): void {
            ResourceManager.loadResource(url, (data) => {
                fish.Log.log("load SkinJson:" + url);
                window["JSONParseClass"]["setData"](data);
                onComplete.call(thisObj, generateJSON);
            }, this, RES.ResourceItem.TYPE_JSON, onError);
        }

        //set resource dispose
        public static setDisposeBlackFilter(blackFilter: string | string[]): void {
            let addBlack = (filter: string) => {
                if (this.resDisposeBlackMap.indexOf(filter) == -1) {
                    this.resDisposeBlackMap.push(filter);
                    for (let code in this.resMap) {
                        let res = this.resMap[code];
                        if (res.res.indexOf(filter) != -1) {
                            res.dispose = false;
                            break;
                        }
                    }
                }
            }

            if (typeof blackFilter == 'string') {
                addBlack.call(this, blackFilter);
            } else {
                for (let filter of blackFilter) {
                    addBlack.call(this, filter);
                }
            }
        }

        //通用的资源加载--支持本地及远程（url/DisplayObject/Texture/class）
        public static loadResource(source: any, onComplete: Function, thisObj: any, type?: string, onError?: Function): void {
            let onGetRes = (data: any) => {
                if (onComplete) {
                    if (onComplete.length == 1) {
                        onComplete.call(thisObj, data);
                    } else if (onComplete.length == 2) {
                        onComplete.call(thisObj, data, source);
                    } else {
                        onComplete.call(thisObj);
                    }
                }
            }

            let content: any = source;
            if (source.prototype) {
                content = new source();
            }
            if (content instanceof egret.DisplayObject || content instanceof egret.Texture) {
                onComplete.call(thisObj, content, source);
            } else if (typeof (source) == 'string') {
                if (!type) {
                    type = ResourceManager.getTypeByUrl(source);
                }
                if (!RES.hasRes(source)) {
                    RES.getResByUrl(source, onGetRes, this, type)
                        .catch((reason) => {
                            if (onError) onError.call(thisObj);
                        })
                } else {
                    let data = RES.getRes(source);
                    if (data) {
                        onGetRes(data);
                    } else {
                        let p = RES.getResAsync(source) as Promise<any>;
                        p.then((data) => {
                            onGetRes(data);
                        }, (reason) => {
                            if (onError) onError.call(thisObj);
                        });
                    }
                }
            } else {
                onComplete.call(thisObj, content, source);
            }
        }

        //通过url判断加载文件的类型
        public static getTypeByUrl(url: string): string {
            let suffix: string = url.toLowerCase().split('?')[0];
            suffix = suffix.substr(suffix.lastIndexOf('.') + 1);
            if (suffix) {
                suffix = suffix.toLowerCase();
            }

            let type: string = '';
            switch (suffix) {
                case RES.ResourceItem.TYPE_XML:
                case RES.ResourceItem.TYPE_JSON:
                case RES.ResourceItem.TYPE_SHEET:
                    type = suffix;
                    break;
                case 'png':
                case 'jpg':
                case 'gif':
                    type = RES.ResourceItem.TYPE_IMAGE;
                    break;
                case 'fnt':
                    type = RES.ResourceItem.TYPE_FONT;
                    break;
                case 'txt':
                case 'exml':
                    type = RES.ResourceItem.TYPE_TEXT;
                    break;
                case 'mp3':
                case 'ogg':
                case 'mpeg':
                case 'wav':
                case 'mp4':
                case 'aiff':
                case 'wma':
                case 'mid':
                    type = RES.ResourceItem.TYPE_SOUND;
                    break;
                default:
                    type = RES.ResourceItem.TYPE_BIN;
                    break;
            }
            return type;
        }
    }
}