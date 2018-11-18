namespace fish {
    export interface IEffect {
        start(target:egret.DisplayObject, ags?:any):void;//开始效果
        stop(target:egret.DisplayObject, ags?:any):void;
    }
}