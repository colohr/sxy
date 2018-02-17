const {is} = require('fxy')
const StructStore = {
	delete(structure,type){
		if(this.map){
			if(is.nothing(structure)) delete this.map
			else if(this.map.has(structure)){
				if(is.nothing(type)) this.map.delete(structure)
				else this.map.get(structure).delete(type)
			}
		}
		return this
	},
	get(structure,type){ return this.has(structure,type) ? this.map.get(structure).get(type):null  },
	has(structure,type){ return 'map' in this && this.map.has(structure) && this.map.get(structure).has(type) },
	limit:(1000*60)*20,
	get preset(){ return {keep_fields_intact:false, no_storage:false} },
	set(structure,type,value){
		if(!is.map(type) || is.nothing(value)) return null
		let storage = this.get(structure,type)
		if(!storage) {
			if(!this.map) this.map = new WeakMap()
			storage = this.map.set(structure,new WeakMap()).get(structure)
		}
		return storage.set(type,value).get(type)
	}
}

//exports
module.exports = struct_store

//shared actions
function struct_store(type,structstore){
	if(is.nothing(structstore) && StructStore.has(type.constructor,type)) return StructStore.get(type.constructor,type)
	const did_set = StructStore.set(type.constructor, type, structstore)
	if(did_set) watch_struct_store()
}

function on_struct_store_tick(){
	const expired = (new Date() - StructStore.watch_started) > StructStore.limit
	if(expired){
		StructStore.watching = clearInterval(StructStore.watching)
		delete StructStore.watch_started
		delete StructStore.watching
		StructStore.delete()
	}
}

function watch_struct_store(){
	if(typeof StructStore.watching === 'number') StructStore.watching = clearInterval(StructStore.watching)
	StructStore.watch_started = new Date()
	StructStore.watching = setInterval(on_struct_store_tick,1000)
}