namespace game {
    export class GameWindowNavigator extends fish.WindowNavigator {
        private static highFpsWindows: number[] = [];
        // private loading: WindowLoading;
        constructor() {
            super(fish.StageManager.getLayer(fish.Layer.WINDOW), fish.ScaleBackEffect);
            // this.loading = new WindowLoading(500);
            // GameWindowNavigator.highFpsWindows.push(WindowType.WINDOW_RECALLFRIEND_PLAYERS);
        }

        protected onStateChanged(window: fish.IWindow, state: fish.WindowState): void {
            let winData:fish.WindowData = this.getWindowData(window.id);
            if (state == fish.WindowState.Loading) {
                // this.loading.loadingState = true;
            } else if (state == fish.WindowState.Prepare) {
                if (winData.groupId == '' && fish.WindowManager.isModaling) {
                    // TweenUtil.pauseAllTweens();
                    // fish.ArmaturePlayer.pauseAll();
                    // fish.MoviePlayer.pauseAll();
                }
            } else if (state == fish.WindowState.open) {
                if (this.getWindowData(window.id).groupId == '') {
                    GameWindowNavigator.updateFrameRate(window);
                }
                // !this.isLoading && (this.loading.loadingState = false);
                // let gate = gateModel.getGate(window.id);
                // if (gate) gate.isOpened = true;
                fish.NotificationManager.dispatch(NotificationType.WINDOW_ENTER, window.id);
            } else if (state == fish.WindowState.Close) {
                // !this.isLoading && (this.loading.loadingState = false);
                if (this.getWindowData(window.id).groupId == '') {
                    GameWindowNavigator.updateFrameRate(window);
                }
                fish.NotificationManager.dispatch(NotificationType.WINDOW_CLOSE, window.id);
                if (winData.groupId == '') {
                    // TweenUtil.resumeAllTweens();
                    // fish.ArmaturePlayer.resumeAll();
                    // fish.MoviePlayer.resumeAll();
                }
            }
        }

        //开放域和kfc活动帧频60，其他自动帧频
        public static updateFrameRate(window: fish.IWindow): void {
            //update frameRate
            // let frameRateFull = false;
            // for (let index = 0; index < this.highFpsWindows.length; index++) {
            //     const element = this.highFpsWindows[index];
            //     if (fish.WindowManager.isActive(element) || fish.ScreenManager.isActive(element)) {
            //         frameRateFull = true;
            //         break;
            //     }
            // }
            // fish.StageManager.stage["fixFrameRate"] = frameRateFull ? 60 : -1;
            // if (GameWindowNavigator.highFpsWindows.indexOf(window.id) != -1) {
            //     fish.autoFrameRate();
            // }
            //update touchIgnore
            let touchIgnore = fish.WindowManager.isModaling;
            fish.StageManager.getLayer(fish.Layer.FACEUI)["touchIgnore"] = touchIgnore;
            fish.StageManager.getLayer(fish.Layer.SCREEN)["touchIgnore"] = touchIgnore;
        }
    }
}