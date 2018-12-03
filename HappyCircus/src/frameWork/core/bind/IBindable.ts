namespace fish {
    export interface IBindable {
        bind(property: string, target: any, setterOrFunction?: any): void;
        unbind(target: any, property?: string): void;
    }
}