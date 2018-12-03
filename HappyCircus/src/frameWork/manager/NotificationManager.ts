namespace fish {
    export class NotificationManager {
        private static notificationMap: Object = new Object(); // 通知载体map
		/**
		 * 注册回调函数
		 * @param message 消息名字
		 * @param callback 回调函数
		 */
        public static add(message: string, callback: Function, thisObject: any): void {
            let callbacks: Array<any> = (this.notificationMap[message]) || (new Array<any>());
            //过滤
            if (this.getCallBackIndex(callbacks, callback, thisObject) == -1) {
                callbacks.push({ func: callback, thisObject: thisObject });
                this.notificationMap[message] = callbacks;
            }
        }

		/**
		 * 执行Notification
		 * @param message 消息名字
		 * @param contents 参数，可以无限多个
		 */
        public static dispatch(message: string, ...contents): void {
            this.dispatchByArray(message, contents);
        }

		/**
		 * 执行Notification， 参数以数组形式传递。
		 * @param message 消息名字
		 * @param contents 参数，可以无限多个
		 */
        public static dispatchByArray(message: string, contents?: Array<any>): void {
            let observers: Array<any> = this.notificationMap[message];
            if (!observers) { // 如果指定 message 没有注册
                return;
            }
            let length: number = observers.length;
            for (let i: number = 0; i < length; i++) {
                let obj: any = observers[i];
                if (obj) {
                   if (obj["func"]) {
                        let func: Function = <Function><any>obj["func"];
                        if (func.length == 0) {
                            func.apply(obj["thisObject"]);
                        } else {
                            func.apply(obj["thisObject"], contents);
                        }
                    }
                }
            }
        }


		/**
		 * 移除 Callback，监听到message的时候不在处罚callback
		 * @param message 消息名字
		 * @param callback 回调
		 */
        public static remove(message: string, callback: Function, thisObject: any): void {
            if (!callback) {
                delete this.notificationMap[message];
            } else {
                let callbacks: Array<any> = this.notificationMap[message];

                if (callbacks) {
                    let index: number = this.getCallBackIndex(callbacks, callback, thisObject);
                    if (index >= 0) {
                        callbacks.splice(index, 1);
                        if (callbacks.length <= 0) {
                            delete this.notificationMap[message];
                        }
                    }
                }
            }
        }

        public static clear(): void {
            this.notificationMap = new Object();
        }

        private static getCallBackIndex(callBacks: Array<any>, callback: Function, thisObject: any): number {
            let len: number = callBacks.length;
            for (let i = 0; i < len; i++) {
                let callObj: Object = callBacks[i];
                if ((callObj["func"] === callback) && (callObj["thisObject"] === thisObject)) {
                    return i;
                }
            }
            return -1;
        }
    }
}