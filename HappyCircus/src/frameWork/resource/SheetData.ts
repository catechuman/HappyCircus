namespace fish {
    export class SheetData {
        public isDisposed:boolean;
        public name:string;
        public texture:egret.Texture;
        public spriteSheet:egret.SpriteSheet;
        public sheetConfig:any;
        private mcFactory:egret.MovieClipDataFactory;

        constructor(name:string, texture:egret.Texture, sheetConfig:any, spriteSheet?:egret.SpriteSheet) {
            this.name = name;
            this.texture = texture;
            this.sheetConfig = sheetConfig;
            this.spriteSheet = spriteSheet;
        }

        //释放资源
        public dispose(clear: boolean = false): void {
            if (clear) {
                this.spriteSheet.dispose();
                this.texture = null;
                this.spriteSheet = null;
                this.sheetConfig = null;
                this.mcFactory = null;
            }
        }

        //获取材质资源
        public getTexture(textureName: string): egret.Texture {
            return this.spriteSheet.getTexture(textureName);
        }
    }
}