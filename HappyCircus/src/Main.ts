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

    private loadResource() {
        fish.ResourceManager.loadViewResource("preload", () => {
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
}
