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
		return this
	}
}

class LibraryModule{
	constructor(item){
		this.item = item
	}
	module(){ return require(this.item.get('path')) }
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