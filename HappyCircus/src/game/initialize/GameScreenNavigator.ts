
namespace game {
    export class GameScreenNavigator extends fish.WindowNavigator {
        // private winLoading: WindowLoading;
        constructor() {
            super(fish.StageManager.getLayer(fish.Layer.SCREEN));
            // this.winLoading = new WindowLoading(500);
        }

        //返回
        public back(): boolean {
            let suc = super.back();
            if (!suc) {
                fish.ScreenManager.currentScreen = ScreenType.MainLoop;
            }
            return true;
        }

        protected onStateChanged(window: fish.IWindow, state: fish.WindowState): void {
            if (state == fish.WindowState.Loading) {
                // if (!uiModel.firstEnter) {
                //     this.onLoading(window, true);
                // }
                fish.NotificationManager.dispatch(NotificationType.SCREEN_START, window.id);
            } else if (state == fish.WindowState.open) {
                GameWindowNavigator.updateFrameRate(window);
                this.onLoading(window, false);
                fish.NotificationManager.dispatch(NotificationType.SCREEN_ENTER, window.id);
            } else if (state == fish.WindowState.Close) {
                GameWindowNavigator.updateFrameRate(window);
                !this.isLoading && (this.onLoading(window, false));
                // fish.ResourceManager.unloadUnusedRes();
                fish.NotificationManager.dispatch(NotificationType.SCREEN_CLOSE, window.id);
            }
        }

        private preScreen: string = '';
        private onLoading(window: fish.IWindow, show: boolean): void {
            // let cloudLoading: boolean = this.isCloudScreen(window.id);
            // if (cloudLoading) {
            //     ScreenLoading.instance.loadingState = show;
            // } else {
            //     this.winLoading.loadingState = show;
            // }
            if (!show) {
                this.preScreen = window.id;
            }
        }

        // private isCloudScreen(id: string): boolean {
        //     return id != ScreenType.GUILD_SCREEN && id != ScreenType.GUILD_JOINSCREEN;
        // }
    }

}

