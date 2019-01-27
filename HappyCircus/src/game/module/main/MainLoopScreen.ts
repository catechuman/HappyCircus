/**
* Created by zhouchuang
*/
namespace game {
    export class MainLoopScreen extends fish.Screen {
        /**视图变量(wing复制获得)*/
        public lhand: eui.Image;
        public rhand: eui.Image;
        public lCircle: eui.Image;
        public rCircle: eui.Image;
        public ball: eui.Image;

        /**自定义变量*/
        private p0: { x: number, y: number } = { x: 22, y: 725 };
        private p1: { x: number, y: number } = { x: 320, y: 0 };
        private p2: { x: number, y: number } = { x: 543, y: 725 };

        readonly leftPos: { x: number, y: number } = { x: 22, y: 725 };
        readonly rightPos: { x: number, y: number } = { x: 543, y: 725 };
        constructor() {
            super();
            this.skinName = null;
        }
        //初始化【每个窗口有且仅有一次】
        protected onInit(): void {
            console.log('mainloop init');
            this.addClick(this, this.clickFunc, this);
        }

        //每次打开
        protected onOpen(): void {
            console.log("mainloop onOpen");
            this.ballAction();
        }

        //数据更新(带窗口数据才会执行)
        protected onData(): void {
            console.log("mainloop ondata");

        }

        //准备窗口(主要用于窗口数据的请求回调)
        public prepare(onComplete: Function, onError: Function): void {
            onComplete(null);
        }

        private ballAction(): void {
            egret.Tween.removeTweens(this);
            this.factor = 0;
            let btw = egret.Tween.get(this, { loop: false });
            btw.to({ factor: 1 }, 1500);
        }

        //p0{100, 100} p1{300, 300} p2{100, 500}
        public get factor(): number {
            return 0;
        }

        public set factor(value: number) {
            this.ball.x = (1 - value) * (1 - value) * this.p0.x + 2 * value * (1 - value) * this.p1.x + value * value * this.p2.x;
            this.ball.y = (1 - value) * (1 - value) * this.p0.y + 2 * value * (1 - value) * this.p1.y + value * value * this.p2.y;
        }

        private clickFunc(eve: egret.TouchEvent): void {
            console.log('click Func  x = ' + eve.stageX);
            this.p0 = {x:this.ball.x, y : this.ball.y};
            this.p2 = eve.stageX > 320 ? this.leftPos : this.rightPos;
            this.ballAction();
        }
    }
}