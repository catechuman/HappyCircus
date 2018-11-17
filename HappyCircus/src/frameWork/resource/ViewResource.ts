namespace fish {
    export class ViewResource {

        private resGroup: string;
        private mSheetResources: SheetData[];
        private mIsLoaded: boolean;
        private mAutoDispose: boolean;
        constructor(resGroup: string) {
            this.resGroup = resGroup;
            this.mSheetResources = [];
        }

        public load(onComplete: Function = null, onError: Function = null, thisObj: any = null): boolean {
            let onResourceComplete = () => {
                if (this.resGroup || !this.isLoaded) {
                    this.mIsLoaded = true;
                    let items = RES.getGroupByName(this.resGroup);
                    for (let i = 0; i < items.length; i++) {
                        let item = items[i];
                        if (item.type == RES.ResourceItem.TYPE_SHEET) {
                            this.mSheetResources.push(ResourceManager.getSheet(item.name));
                        }
                    }
                }

                if (onComplete != null) {
                    if (onComplete.length == 1) {
                        onComplete.call(thisObj, this);
                    } else {
                        onComplete(thisObj);
                    }
                }
            }

            if (this.isLoaded || !this.resGroup) {
                onResourceComplete.call(this);
                return false;
            }

            ResourceManager.loadGroup(this.resGroup, 0, onResourceComplete.bind(this), onError, thisObj);
            return true;
        }

        public get isLoaded(): boolean {
            return this.mIsLoaded;
        }
    }
}