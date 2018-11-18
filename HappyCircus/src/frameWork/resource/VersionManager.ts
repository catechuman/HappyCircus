namespace fish {
    export class VersionManager {
        public static removeResUrlVersion(url:string):string {
            const index = url.indexOf('?v=');
            if(index != -1) {
                url = url.slice(0, index);
            }
            return url;
        }
    }
}