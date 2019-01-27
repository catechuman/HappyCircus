
namespace game {

    export class ResourcePath {
        /**
         * 游戏资源md5映射
         */
        private static md5Map: any = {};

        /**
         * 初始化
         */
        public static initialize(): void {
        }

        /**获取资源地址*/
        public static getResUrlByVersion(url: string, ...rest): string {
            url = fish.StringUtil.substitute(url, rest);
            return url;
        }

        //-------------------------------------图片文件相关路径--------------------------------------
        /**
        /**获取音乐音效文件*/
        public static getSoundPath(soundName: string): string {
            return ResourcePath.getResUrlByVersion("assets/sound/{0}.mp3", soundName);
        }

        //获取序列帧
        public static getMovieClip(mcName: string): string {
            return ResourcePath.getResUrlByVersion("assets/movieclip/{0}/{0}.json", mcName);
        }

        //获取模块图集地址
        public static getTextureRes(id: any): string {
            return ResourcePath.getResUrlByVersion("assets/texture/{0}/{0}.json", id);
        }

        //获取皮肤地址(皮肤路径特殊，全路径)
        public static getSkinRes(path: any): string {
            if (!path) return null;
            return ResourcePath.getResUrlByVersion("resource/eui_skins/{0}.exml", path);
        }

        //获取龙骨动画地址
        public static getDragonPath(name: string): string {
            return ResourcePath.getResUrlByVersion("assets/dragon/{0}", name);
        }

        /**
         * 获取物品图片
         * @param idx   拼图碎片id
         */
        public static getItemIconByName(name: string): string {
            return ResourcePath.getResUrlByVersion(`assets/image/items/${name}.png`);
        }

        /**
         * 获取tabbar图片
         * @param idx   拼图碎片id
         */
        public static getTabbarIcon(name: string): string {
            return ResourcePath.getResUrlByVersion(`assets/image/tabbar/${name}.png`);
        }

        //-------------------------------------配置文件相关路径-------------------------------
        public static getLangPath(): string {
            return ResourcePath.getResUrlByVersion("assets/config/lang.json");
        }

        //新手配置文件
        public static getTutorialConfig(tutorialId: string): string {
            return ResourcePath.getResUrlByVersion(`assets/config/tutorial/${tutorialId}.json`);
        }

        //新手配置文件
        public static getWxAuthImage(): string {
            return ''
            // return fish.VersionManager.getResUrlByVersion("assets/image/platform/wx_AuthBtn.png");
        }
        
        //授权背景
        public static getWxAuthBgImage(): string {
            return ''
            // return fish.VersionManager.getResUrlByVersion("assets/image/platform/wx_authBg.png");
        }

    }
}