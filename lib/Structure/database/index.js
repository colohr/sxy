


const data_path = Symbol.for('Firebase reference path')
const data_reference = Symbol.for('Firebase database reference')
const data_on = Symbol.for('Firebase database reference on action')

class Database{
	
	constructor(path){
		const base = require('firebase-admin')
		this[data_path] = path
		this[data_reference] = base.ref(path)
	}
	
	child(name){ return this.collection.child(name) }
	
	get collection(){ return this[data_reference] }
	
	collection_value(){
		return new Promise((resolve,reject)=>{
			return this.collection.once('value').then(snapshot=>{
				return resolve( get_value_snapshot(snapshot) )
			}).catch(reject)
		})
	}
	
	get on(){
		if(!this[data_on]) this[data_on] = get_on_value_actions(this)
		return this[data_on]
	}

	save(name, value){
		return new Promise((resolve,reject)=>{
			return this.child(name)
			           .update( get_value_for_save(value) )
			           .then(resolve)
			           .catch(reject)
		})
	}
	
	get source_name(){return 'firebase'}
	
	value(name){
		return new Promise((resolve,reject)=>{
			let child = this.child(name)
			return child.once('value')
			            .then(snapshot=>{
							return resolve( get_value_snapshot(snapshot) )
						})
			            .catch(reject)
		})
	}
	
}


module.exports = (...args)=>{
	return new Database(...args)
}


//----------shared actions-----------

function get_value_snapshot(ss){
	return new Proxy(ss,{
		get(o,k){
			
			switch(k){
				case 'count':
				case 'length':
					return o.numChildren()
					break;
				case 'value':
				case 'data':
					return o.val()
					break;
				case 'empty':
					let e = o.exists()
					if(e === true){
						return o.numChildren() === 0
					}
					return e !== true;
					break;
				case 'array':
					let v = o.val()
					if(typeof v === 'object' && v !== null){
						return Object.keys(v).map(key=>{return v[key]});
					}
					return []
					break;
				case 'isNull':
					return o.val() === null;
					break;
				
			}
			
			if(k in o) return o[k];
			return;
		}
	})
}

function get_value_for_save(value){
	if(Array.isArray(value)){
		let o = {}
		value.forEach((item,i)=>{
			o[i] = item;
		})
		return o
	}
	return value;
}

function get_on_value_actions(base){
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

