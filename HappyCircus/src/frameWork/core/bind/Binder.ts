namespace fish {
	export class Binder {
		private static bindings: HashMap = new HashMap();

		public source: any;
		private propertys: Object = new Object();
		private propertyCount: number = 0;
		private onChange: Function;
		constructor(source: any, onChange: Function = null) {
			this.source = source;
			this.onChange = onChange;
			Binder.bindings.put(source, this);
		}

		/**
		 * 绑定目标
		 * eg...model.bind("price",price_txt,"text")
		 * eg...model.bind("price",price_txt,onPriceChange)
		 * @param	property
		 * @param	target
		 * @param	setterOrFunction
		 */
		public bind(property: string, target: any, setterOrFunction: any = "text"): void {
			let bindProperty: BindProperty = this.propertys[property];
			if (bindProperty == null) {
				bindProperty = new BindProperty(this.source, property, this.onChange);
				this.propertys[property] = bindProperty;
				this.propertyCount++;
			}
			bindProperty.bind(target, setterOrFunction);
		}

		/**
		 * 解除绑定
		 * @param	target
		 * @param	property
		 */
		public unbind(target: any, property: string = "text"): void {
			let bindProperty: BindProperty;
			let instance: Binder = this;
			if (property) {
				bindProperty = this.propertys[property];
				if (bindProperty) unbindSingle(bindProperty);
			} else {
				for (let i in this.propertys) {
					bindProperty = this.propertys[i];
					unbindSingle(bindProperty);
				}
			}

			function unbindSingle(bproperty: BindProperty): void {
				let hasElement: boolean = bproperty.unbind(target);
				if (!hasElement) {
					delete instance.propertys[bproperty.property];
					instance.propertyCount--;
					if (instance.propertyCount <= 0)
						Binder.bindings.remove(instance.source);
				}
			}
		}

		/**
		 * 设置属性，触发绑定
		 * @param	property
		 * @param	value
		 */
		public setProperty(property: string, value: any, forceRefresh: boolean = false): void {
			let bindProperty: BindProperty = this.propertys[property];
			if (bindProperty) {
				bindProperty.forceRefresh = forceRefresh;
				bindProperty.value = value;
			} else {
				this.source[property] = value;
			}
		}

		/**
		 * 强制更新一次属性
		 * @param	property
		 */
		public updateProperty(property: string): void {
			let bindProperty: BindProperty = this.propertys[property];
			if (bindProperty)
				this.setProperty(property, this.source[property], true);
		}

		/**
		 * 获取属性值
		 * @param	property
		 * @return
		 */
		public getProperty(property: string): any {
			return this.source[property];
		}

		/**
		 * 清除
		 */
		public dispose(): void {
			if (this.propertys != null) {
				for (let i in this.propertys) {
					let item: BindProperty = this.propertys[i];
					item.dispose();
					delete this.propertys[item.property];
				}
				this.propertys = null;
			}
			if (this.source != null) {
				Binder.bindings.remove(this.source);
				this.source = null;
			}

			this.propertyCount = 0;
			this.onChange = null;
		}

		public static create(source: any, property: string, target: any, setterOrFunction: any = "text"): Binder {
			let binder: Binder = Binder.bindings.getValue(source) || (new Binder(source));
			binder.bind(property, target, setterOrFunction);
			return binder;
		}

		public static remove(target: any, property: string = "text"): void {
			let length: number = Binder.bindings.length;
			for (let i: number = 0; i < length; i++) {
				let item: Binder = Binder.bindings[i];
				item.unbind(target, property);
			}
		}
	}

	export class BindProperty {
		public source: any;
		public property: string;
		public oldValue: any;
		public newValue: any;
		public forceRefresh: boolean;
		public targets: HashMap = new HashMap();
		private targetCount: number = 0;
		private onChange: Function;
		private getF = null;
		private setF = null;
		constructor(source: any, property: string, onChange: Function = null) {
			this.source = source;
			this.onChange = onChange;
			this.property = property;
			this.oldValue = this.newValue = source[property];
			let instance = this;
			//获取原始的get set方法
			let d = source.constructor.prototype;
			while (!d.hasOwnProperty(property)) {
				d = Object.getPrototypeOf(d);
				if (d == null) {
					break;
				}
			}
			if (d) {
				this.getF = Object.getOwnPropertyDescriptor(d, property).get;
				this.setF = Object.getOwnPropertyDescriptor(d, property).set;
			}
			//重新定义get set
			Object.defineProperty(source, property, {
				set: function (newVal) {
					if (instance.setF) instance.setF.call(source, newVal);
					instance.value = newVal;
				},
				get: function () {
					if (instance.getF) return instance.getF.call(source);
					return instance.value;
				}
			});
		}

		public bind(target: any, setterOrFunction: any = null): void {
			target.hasBinder=true;
			if (setterOrFunction == null) setterOrFunction = this.property;
			if (!this.targets.containsKey(target)) {
				this.targets.put(target, new BindTarget(target, setterOrFunction));
				this.targetCount++;
			}
			this.oldValue = this.value;
			this.fixBind(this.targets.getValue(target), this.oldValue);
		}

		public unbind(target: any): boolean {
			target.hasBinder=false;
			let bindTarget: BindTarget = this.targets.getValue(target);
			if (bindTarget) {
				bindTarget.dispose();
				this.targets.remove(target);
				this.targetCount--;
				return this.targetCount > 0;
			}
			return true;
		}

		public get value(): any {
			return this.newValue;
		}

		public set value(val: any) {
			if (this.forceRefresh || (this.newValue!== val)) {
				this.oldValue = this.value;
				this.newValue = val;
				for (let i in this.targets.content) {
					let bindTarget: BindTarget = this.targets.content[i];
					this.fixBind(bindTarget, val);
				}
				if (this.onChange != null) this.onChange();
			}
		}

		private fixBind(bindTarget: BindTarget, val: any): void {
			if (bindTarget.targetSetter != null) {
				val = (bindTarget.targetSetter == 'text') ? <string><any>val : val;
				bindTarget.target[bindTarget.targetSetter] = val;
			} else if (bindTarget.targetFunction != null) {
				let len: number = bindTarget.targetFunction.length;
				if (len == 0) {
					bindTarget.targetFunction.call(bindTarget.target);
				} else if (len == 1) {
					bindTarget.targetFunction.call(bindTarget.target, val);
				} else if (len == 2) {
					bindTarget.targetFunction.call(bindTarget.target, val, this.oldValue);
				} else {
					throw new Error("绑定属性的回调函数参数错误!");
				}
			}
		}

		public dispose(): void {
			this.source = null;
			this.property = null;
			this.oldValue = null;
			this.targetCount = 0;
			for (let i in this.targets.content) {
				let bindTarget: BindTarget = this.targets.content[i];
				bindTarget.dispose();
			}
			this.targets.clear();
			this.targets = null;
		}
	}

	export class BindTarget {
		public target: any;
		public targetSetter: string;
		public targetFunction: Function;
		constructor(target: any, setterOrFunction: any = null) {
			this.target = target;
			if (typeof (setterOrFunction) == 'function') {
				this.targetSetter = null;
				this.targetFunction = <Function><any>setterOrFunction;
			} else {
				this.targetSetter = <string><any>setterOrFunction;
				this.targetFunction = null;
			}
		}

		public dispose(): void {
			this.target = null;
			this.targetSetter = null;
			this.targetFunction = null;
		}
	}
}