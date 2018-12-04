namespace fish {
    export class Log {
        private static mShowLog:boolean = true;
        public static showLog(value:boolean):void {
            this.mShowLog = value;
        }

        public static log(...rest):void {
            if(this.mShowLog) {
                console.log.apply(console, this.getMessage(rest));
            }
        }

        public static fatal(...rest):void {
            console.log.apply(console, this.getMessage(rest));
        }
        public static warn(...rest):void {
            console.warn.apply(console, this.getMessage(rest));
        }
        public static error(...rest):void {
            console.error.apply(console, this.getMessage(rest));
        }

        private static getMessage(result:any[]):any[] {
            return result;
        }
    }
}