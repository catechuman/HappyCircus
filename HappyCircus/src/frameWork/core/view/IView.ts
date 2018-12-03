namespace fish {
    export interface IView {
        //窗口数据
        data: any;
        //窗口的name
        id: string;
        //效果设置
        effect:IEffect;
        //是否打开
        isOpen: boolean;
        //是否已初始化
        isInitialized: boolean;
        //加载
        load(skinUrl?: string, resGroup?: string, onComplete?: Function, onError?: Function, thisObject?: any): boolean;
        //显示
        show(container: egret.DisplayObjectContainer, data?: any, onOpenFunc?: Function, onCloseFunc?: Function, thisObject?: any): boolean;
        //隐藏
        hide(dispose?: boolean, withEffect?: boolean): boolean;
        //准备
        prepare(onComplete: Function, onError: Function, data?: any): void;
    }
}