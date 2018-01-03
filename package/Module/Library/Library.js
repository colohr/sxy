const fxy = require('fxy')
const Struct = require('./Struct')
const libraries = require('./libraries')
const library_name = Symbol('Library Name')
const library_folder = Symbol('Library Folder')

class Library extends Struct(Map){
	static get folder(){ return library_folder }
	static get(name){ return libraries.get(name) }
	static has(name){ return libraries.has(name) }
	static get item(){ return library_item }
	static get Module(){ return require('./Module') }
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
	
}

//exports
module.exports = Library

//shared actions
function library_item(name){
	if(libraries.has(name)) return libraries.get(name)
	return libraries.set(name,new Library({name})).get(name)
}