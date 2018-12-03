namespace fish {
    export class Screen extends Window implements IScreen{
        public viewNavigator:WindowNavigator;

        //设置和获取当前窗口
        public get currentView():string {
            return this.viewNavigator.currentWindow;
        }
        public set currentView(value:string) {
            this.viewNavigator.currentWindow = value;
        }

        public registView(viewId:string, view:any):void {
            if(this.viewNavigator == null) {
                this.viewNavigator = new WindowNavigator(this);
            }
            this.viewNavigator.registWindow(viewId, view, null, null, -1, false);
        }

        public unRegistView(viewId:string):void {
            this.viewNavigator.unRegistWindow(viewId);
        }

        public hasView(viewId:string):boolean {
            return this.viewNavigator.hasWindow(viewId);
        }
        public getView(viewId:string):IView {
            return this.viewNavigator.getWindow(viewId);
        }
        public showView(viewId:string, data?:any):void{
            this.viewNavigator.showWindow(viewId, data);
        }

        protected onClose():void {
            super.onClose();
            if(this.viewNavigator) {
                this.viewNavigator.currentWindow = '';
            }
        }

    }
}