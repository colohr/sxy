
const get_value_snapshot = require('./snapshot')

module.exports  = function get_on_value_actions(base){
	return new Proxy({
		base,
		names:[ 'added','removed','changed','moved' ],
		events:new Map(),
		connect(){
			const on = this
			const collection = on.base.collection;
			this.names.forEach(name=>{
				let type = `child_${name}`
				collection.on(type, (...args) => {
					if( on.events.has(type) ){
						args[0] = get_value_snapshot(args[0])
						on.events.get(type)(...args);
					}
				});
			});
			return this;
		},
		get(key){
			let type = `child_${key}`
			return this.events.get(type);
		},
		set(key,value){
			let type = `child_${key}`
			this.events.set(type,value);
			return this;
		}
	},{
		get(o,k){
			if(o.events.includes(k)) return this.get(k)
			if(k in o) return o[k]
			return null;
		},
		set(o,k,v){
			if(o.events.includes(k)) this.set(k,v);
			return true;
		}
	})
}