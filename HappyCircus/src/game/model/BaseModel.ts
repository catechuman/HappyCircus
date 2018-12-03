namespace game {
    export class BaseModel extends fish.Model {
        //刷新局部数据
		public update(data: any) {
			this.inject(data);
		}
    }
}
let baseModel:game.BaseModel;