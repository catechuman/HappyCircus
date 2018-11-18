namespace fish {
    export interface IWindowEffect extends IEffect {
        show(target: egret.DisplayObject, onComplete: Function, args?: any):void;
        hide(target: egret.DisplayObject, onComplete: Function, args?: any):void;
    }
}