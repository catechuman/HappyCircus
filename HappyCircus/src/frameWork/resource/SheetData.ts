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
    }
}