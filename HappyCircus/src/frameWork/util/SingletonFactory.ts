
namespace fish {
	/**
	 * 单例工厂
	 */
    export function singletonFactory(type: any): any {
        var instanse: any = instances.getValue(type);
        return instanse ? instanse : instances.put(type,new type());
	}
}

var instances: fish.HashMap = new fish.HashMap();