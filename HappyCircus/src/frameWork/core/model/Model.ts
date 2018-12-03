
namespace fish {
	export class Model implements IBindable {
		private _binder: Binder;
		private _onChangeFunc: Function;
		public isPersistant: boolean = true;//是否持久保存
		constructor(source: any = null) {
			if (source != null) {
				this.inject(source);
			}
		}

		/**
		 * 绑定对象
		 * @param	property
		 * @param	target
		 * @param	setterOrFunction
		 */
		public bind(property: string, target: any, setterOrFunction: any = "text"): void {
			if (this._binder == null)
				this._binder = new Binder(this, this.onPropertyChange);

			if (property == null && (setterOrFunction instanceof Function)) {
				this._onChangeFunc = setterOrFunction;
			} else {
				this._binder.bind(property, target, setterOrFunction);
			}
		}

		/**
		 * 解除绑定
		 * @param	target
		 * @param	property
		 */
		public unbind(target: any, property: string = null): void {
			if (this._binder != null)
				this._binder.unbind(target, property);
		}

		//释放
		public dispose(): void {
			if (!this.isPersistant) {
				if (this._binder) {
					this._binder.dispose();
					this._binder = null;
				}
				this._onChangeFunc = null;
			}
		}

		/**
		 * 为模型注入新的数据
		 **/
		public inject(data: any): void {
			for (let key in data) {
				if (this.hasOwnProperty(key)) {
					if (this[key] && (typeof this[key] == "object")) {
						this.updateData(this[key], data[key]);
					} else {
						this[key] = data[key];
					}
				}
			}
		}

		private updateData(target: any, data: any): void {
			for (let key in data) {
				target[key] = data[key];
			}
		}

		/**设置属性值*/
		public setProperty(property: string, value: any, forceRefresh: boolean = false): void {
			if (this._binder != null) {
				this._binder.setProperty(property, value, forceRefresh);
			} else {
				this[property] = value;
			}
		}

		/**
		 * 强制更新一次属性
		 * @param	property
		 */
		public updateProperty(property: string): void {
			if (this._binder != null) {
				this._binder.updateProperty(property);
			}
		}

		/**
		 * 获取模型的数据源表示形式,可遍历的Object类型
		 * @param	property
		 */
		public get source(): any {
			return this._binder ? this._binder.source : this;
		}

		/**
		 * 克隆
		 */
		public clone(): Model {
			var newModel: Model = construct(this);
			newModel.inject(this.source);
			return newModel;
		}

		/**
		 * 当属性发生变化
		 */
		public onPropertyChange(): void {
			if (this._onChangeFunc != null)
				this._onChangeFunc();
		}

	}

	/**
	 * This function is used to construct an object from the class and an array of parameters.
	 * 
	 * @param type The class to construct.
	 * @param parameters An array of up to ten parameters to pass to the constructor.
	 */
	export function construct(type: any, parameters: Array<any> = null): any {
		//如果不为class，解析对应class
		if (!(type.prototype)) {
			type = type.constructor;
		}

		if (parameters == null)
			return new type();

		switch (parameters.length) {
			case 0:
				return new type();
			case 1:
				return new type(parameters[0]);
			case 2:
				return new type(parameters[0], parameters[1]);
			case 3:
				return new type(parameters[0], parameters[1], parameters[2]);
			case 4:
				return new type(parameters[0], parameters[1], parameters[2], parameters[3]);
			case 5:
				return new type(parameters[0], parameters[1], parameters[2], parameters[3], parameters[4]);
			case 6:
				return new type(parameters[0], parameters[1], parameters[2], parameters[3], parameters[4], parameters[5]);
			case 7:
				return new type(parameters[0], parameters[1], parameters[2], parameters[3], parameters[4], parameters[5], parameters[6]);
			case 8:
				return new type(parameters[0], parameters[1], parameters[2], parameters[3], parameters[4], parameters[5], parameters[6], parameters[7]);
			case 9:
				return new type(parameters[0], parameters[1], parameters[2], parameters[3], parameters[4], parameters[5], parameters[6], parameters[7], parameters[8]);
			case 10:
				return new type(parameters[0], parameters[1], parameters[2], parameters[3], parameters[4], parameters[5], parameters[6], parameters[7], parameters[8], parameters[9]);
			default:
				return null;
		}
	}
}