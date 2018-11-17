namespace fish {
    export interface IScreen extends IView {
        currentView:number;
        registView(viewId:number, view:any):void;
        unRegistView(viewId:string):void;
        hasView(viewId:string):boolean;
        getView(viewId:string):IView;
        showView(viewId:string, data?:any):void;
   }
}