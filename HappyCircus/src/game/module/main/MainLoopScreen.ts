/**
* Created by zhouchuang
* Copyright (c) 2017 HortorGames. All rights reserved.
*/
namespace game {
    export class MainLoopScreen extends fish.Screen {
        /**视图变量(wing复制获得)*/
        
        /**自定义变量*/
        constructor() {
            super();
            this.skinName = null;
        }
        //初始化【每个窗口有且仅有一次】
        protected onInit(): void {
            console.log('mainloop init');
            let icon: egret.Bitmap = ComFunc.createBitmapByName("egret_icon_png");
            this.addChild(icon);
            icon.x = fish.StageManager.stageWidth * 0.5;
            icon.y = fish.StageManager.stageHeight * 0.5;
        }
            
        //每次打开
        protected onOpen(): void {
            console.log("mainloop onOpen");
        }
            
        //数据更新(带窗口数据才会执行)
        protected onData(): void {
            console.log("mainloop ondata");
         
        }
            
        //准备窗口(主要用于窗口数据的请求回调)
        public prepare(onComplete: Function, onError: Function): void {
            onComplete(null);
        }
            
    }
}