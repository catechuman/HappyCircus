//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class Main extends eui.UILayer {
    public isWxgame: boolean = false;
    protected createChildren(): void {
        super.createChildren();
        egret.ImageLoader.crossOrigin = "anonymous";
        this.stage.maxTouches = 1;
        this.stage.frameRate = 60;
        this.isWxgame = fish.SystemManager.isWxGame;

        fish.StageManager.initialize(this.stage, this);
        game.ComFunc.checkMobileDevice();
        this.initConfig();
    }

    //初始化配置
    private initConfig(): void {
        this.initResDisposeBlack();
        this.initResourceManager();
    }

    //初始化资源释放黑名单
    private initResDisposeBlack(): void {
        // fish.ResourceManager.setDisposeBlackFilter(["image/tabbar"]);
    }

    //初始化resourceManager
    private initResourceManager(): void {
        fish.ResourceManager.initialize(game.GameConfig.version, game.GameConfig.resRoot, this.loadTheme, null, this);
    }

    //加载皮肤--可以考虑多种形式
    private loadTheme(): void {
        // if (!RELEASE) {
        //     var theme = new eui.Theme(`resource/default.thm.json`, this.stage);
        //     theme.addEventListener(egret.Event.COMPLETE, this.startLoadingAsset, this);
        // } else {
        //     fish.ResourceManager.loadSkinJson("assets/skins/component_EUI.json", this.startLoadingAsset, this.quitGame, this);
        // }
        //使用com2
        let theme = new eui.Theme(`resource/default.thm.json`, this.stage);
        theme.addEventListener(egret.Event.COMPLETE, this.loadResource, this);
    }

    private async runGame() {
        await this.loadResource()
        this.createGameScene();
        const result = await RES.getResAsync("description_json")
        this.startAnimation(result);
    }

    private loadResource() {
        fish.ResourceManager.loadViewResource("common", () => {
            this.initGame();
            this.loginGame();
        }, this.quitGame, this).autoDispose = false;
    }

    //必要时退出游戏
    private quitGame(): void {
        if (this.isWxgame) {
            wx.showModal("友情提示", "游戏出现异常，请退出重试", false, "取消", null, "退出", "#3cc51f", () => {
                wx.exitMiniProgram(() => { }, () => { }, (res) => { fish.Log.fatal("退出游戏"); });
            });
        } else {
            if (confirm("游戏出现异常，请退出重试")) {}
        }
    }

    private initGame():void {
        baseModel = new game.BaseModel();
        fish.WindowManager.initialize(new game.GameWindowNavigator());
        fish.ScreenManager.initialize(new game.GameScreenNavigator());
        // fish.TipManager.initialize(this.stage, game.SimpleAlertRenderer, game.SimpleTipRenderer, game.SimpleBubbleRenderer, game.SimpleUiTipRenderer);
        fish.Register.initialize(game.WindowRegister);
        fish.Register.initialize(game.ScreenRegister);
        fish.Register.initialize(game.SoundRegister);
        fish.StageManager.stageOffHeight = fish.StageManager.stageHeight - 1039;
        fish.StageManager.stageOffHeight = fish.StageManager.stageOffHeight > 0 ? fish.StageManager.stageOffHeight : 0;
    }

    private loginGame():void {
        fish.ScreenManager.currentScreen = game.ScreenType.MainLoop;
    }

    private textfield: egret.TextField;
    /**
     * 创建场景界面
     * Create scene interface
     */
    protected createGameScene(): void {
        let sky = this.createBitmapByName("bg_jpg");
        this.addChild(sky);
        let stageW = this.stage.stageWidth;
        let stageH = this.stage.stageHeight;
        sky.width = stageW;
        sky.height = stageH;

        let topMask = new egret.Shape();
        topMask.graphics.beginFill(0x000000, 0.5);
        topMask.graphics.drawRect(0, 0, stageW, 172);
        topMask.graphics.endFill();
        topMask.y = 33;
        this.addChild(topMask);

        let icon: egret.Bitmap = this.createBitmapByName("egret_icon_png");
        this.addChild(icon);
        icon.x = 26;
        icon.y = 33;

        let line = new egret.Shape();
        line.graphics.lineStyle(2, 0xffffff);
        line.graphics.moveTo(0, 0);
        line.graphics.lineTo(0, 117);
        line.graphics.endFill();
        line.x = 172;
        line.y = 61;
        this.addChild(line);


        let colorLabel = new egret.TextField();
        colorLabel.textColor = 0xffffff;
        colorLabel.width = stageW - 172;
        colorLabel.textAlign = "center";
        colorLabel.text = "Hello Egret";
        colorLabel.size = 24;
        colorLabel.x = 172;
        colorLabel.y = 80;
        this.addChild(colorLabel);

        let textfield = new egret.TextField();
        this.addChild(textfield);
        textfield.alpha = 0;
        textfield.width = stageW - 172;
        textfield.textAlign = egret.HorizontalAlign.CENTER;
        textfield.size = 24;
        textfield.textColor = 0xffffff;
        textfield.x = 172;
        textfield.y = 135;
        this.textfield = textfield;

        let button = new eui.Button();
        button.label = "Click!";
        button.horizontalCenter = 0;
        button.verticalCenter = 0;
        this.addChild(button);
        button.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonClick, this);
    }
    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    private createBitmapByName(name: string): egret.Bitmap {
        let result = new egret.Bitmap();
        let texture: egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }
    /**
     * 描述文件加载成功，开始播放动画
     * Description file loading is successful, start to play the animation
     */
    private startAnimation(result: Array<any>): void {
        let parser = new egret.HtmlTextParser();

        let textflowArr = result.map(text => parser.parse(text));
        let textfield = this.textfield;
        let count = -1;
        let change = () => {
            count++;
            if (count >= textflowArr.length) {
                count = 0;
            }
            let textFlow = textflowArr[count];

            // 切换描述内容
            // Switch to described content
            textfield.textFlow = textFlow;
            let tw = egret.Tween.get(textfield);
            tw.to({ "alpha": 1 }, 200);
            tw.wait(2000);
            tw.to({ "alpha": 0 }, 200);
            tw.call(change, this);
        };

        change();
    }

    /**
     * 点击按钮
     * Click the button
     */
    private onButtonClick(e: egret.TouchEvent) {
        let panel = new eui.Panel();
        panel.title = "Title";
        panel.horizontalCenter = 0;
        panel.verticalCenter = 0;
        this.addChild(panel);
    }
}
