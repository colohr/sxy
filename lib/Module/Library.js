const fxy = require('fxy')
const library_name = Symbol('Library Name')
const library_folder = Symbol('Library Folder')
const library_struct = Symbol('Library Struct')
const libraries = new Map()

class Library extends Map{
	constructor(data){
		super()
		this.define(data)
	}
	define(data){
		if(fxy.is.data(data)) Object.assign(this,data)
		return this
	}
	get folder(){ return this[library_folder] }
	set folder(value){ return this[library_folder] = value }
	module(){ return library_folder in this ? require(this.folder):null }
	get name(){ return this[library_name] }
	set name(value){ return this[library_name] = value }
	graph_struct(struct){
		if(library_struct in this) return this[library_struct]
		if(fxy.is.nothing(struct)) return null
		let tree = fxy.tree(struct.folder)
		for(let item of tree.items) this.set(item.name,new LibraryModule(item))
		this.set('struct',new LibraryModule({ get value(){ return struct.get('schema') } },true) )
		return this
	}
}

class LibraryModule{
	constructor(item,is_graph_structure = false){
		this.item = item
		this.is_structure = is_graph_structure
	}
	module(){
		if(this.is_structure) return get_library_struct(this.item.value)
		return require(this.item.get('path'))
	}
}

//exports
module.exports = get_library
module.exports.get = get_library_module
module.exports.has = has_library_module

//shared actions
function get_library(data){
	if(fxy.is.data(data) && fxy.is.text(data.name)){
		let library = !libraries.has(data.name) ? new Library(data):libraries.get(data.name)
		library.define(data)
		if(!libraries.has(data.name)) libraries.set(data.name,library)
		return get_proxy(libraries.get(data.name))
	}
	return null
}

function get_library_module(name){ return libraries.get(name) }

function get_library_struct(value){
	//return value
	return new Proxy(value,{ get:get_type, has:has_type })
	//shared actions
	function get_type(o,name){ return has_type(o,name) ? get_type_controller(o._typeMap[name]):null }
	function has_type(o,name){ return name in o._typeMap }
	function get_type_controller(type){
		const type_name = type.constructor.name.replace('GraphQL','')
		const type_value = get_value(type)
		//return value
		return new Proxy(function get_type_value_action(){ return type_value }, {
			get(_,name){
				let o = {type,value:type_value}
				if(name in o.value) return o.value[name]
				else if(name in o.type) return o.type[name]
				if(typeof name === 'string'){
					let rectangular_name = get_rectangular_name(name)
					if(rectangular_name in o.type) return o.type[rectangular_name]
				}
				if(name in o) return o[name]
				return null
			},
			has:has_value
		})
		//shared actions
		function get_rectangular_name(name){ return `_${fxy.id.medial(name)}` }
		function get_value(o){
			let value = {}
			switch(type_name){
				case 'EnumType':
					let list = false
					for(let item of o._values) {
						value[item.name] = item.value
						if(item.name === item.value) list=true
					}
					if(list) return Object.keys(value).map(name=>value[name])
					break
				case 'ObjectType':
				case 'InputObjectType':
					for(let name in o._fields) {
						let field = o._fields[name]
						value[name] = get_type_controller(field.type)
					}
					break
				case 'List':
				case 'Boolean':
				case 'Float':
				case 'ID':
				case 'InterfaceType':
				case 'NonNull':
				case 'Int':
				case 'ScalarType':
				case 'Schema':
				case 'String':
				case 'UnionType':
					value = o
					break
			}
			return value
		}
		function has_value(_,name){
			let o = {type,value:type_value}
			if(name in o || name in o.value || name in o.type) return true
			else if(typeof name === 'string' && (get_rectangular_name(name) in o.type)) return true
			return false
		}
	}
}

function get_proxy(library){
	return new Proxy(library,{
		get(o,name){
			if(name in o){
				if(typeof o[name] === "function")return o[name].bind(o)
				return o[name]
			}
			if(o.has(name)) {
				let value = o.get(name)
				if(value instanceof LibraryModule) return value.module()
				return value
			}
			else if(library_folder in o){
				let library_module = o.module()
				if(name in library_module) return library_module[name]
			}
			return null
		},
		set(o,name,value){
			o[name] = value
			return true
		},
		has(o,name){
			if(name in o) return true
			else if(library_folder in o){
				let library_module = o.module()
				if(name in library_module) return true
			}
			return o.has(name)
		},
		deleteProperty(o,name){
			delete o[name]
			return true
		}
	})
}

function has_library_module(name){ return libraries.has(name) }

