
namespace game {
    export class ScreenRegister extends fish.Register {
        private registScreen<T extends fish.IScreen>(screenType: string, screen: new () => T, skinPath: string = null, resGroup?: string): fish.WindowData {
            var skinUrl: string = skinPath ? ResourcePath.getSkinRes(skinPath) : null;
            return fish.ScreenManager.registScreen(screenType, screen, skinUrl, resGroup);
        }

        public initialize(): void {
            this.registScreen(ScreenType.MainLoop, MainLoopScreen);
            // this.registScreen(ScreenType.PRELOAD_SCREEN, PreloadScreen);
            // this.registScreen(ScreenType.TEST_SCREEN, TestScreen, "test/testScreenSkin");
        }
    }
}