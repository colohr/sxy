const fxy = require('fxy')
//const in_library = Symbol('module is in library')
const Library = require('./Library')
const Module = require('./Module')

//const libraries = new Map()
//const modules = new Map()

module.exports = get_library_module
module.exports.library = define_library




function define_library(data){
	let library = Library(data)
	if(!library) return false
	return library
}

function get_library_module(path){
	let library_name = fxy.dirname(path)
	let library = Library({name:library_name})
	let module_name = path.replace(library_name,'').split('/').filter(item=>item.length).join('/')
	//console.log({module_name})
	//console.log({library})
	if(!library) return null
	
	if(module_name && module_name in library) return library[module_name]
	else{
		let library_module = library.module()
		if(library_module){
			if(!module_name) return library_module
			else if(module_name in library_module) return library_module[module_name]
		}
	}
	
	return null
}

//console.log({library_name})
//if(modules.has(path)){
//	let saved = modules.get(path)
//	if(saved === in_library) mod = Library.get(path,{name:library})
//	else mod = saved
//	return mod.value
//}
//let library_module = Module(path,library,module_path)
//let module_path = null
//if(fxy.is.text(library)) {
//	module_path = fxy.join(library,path)
//	path = `${library}/${path}`
//}
//mod = Module(path,library,module_path)
//if(mod.exists) {
//	if(mod.library){
//		let library = get_library(mod.library)
//		if(library) {
//			library.set(mod.name,mod)
//			modules.set(mod.name,mod)
//		}
//	}
//	else modules.set(mod.name,mod)
//}
//return mod.value

//function add_modules(library,...mods){
//	for(let mod of mods){
//		library.set(mod.name,mod)
//		modules.set(mod.name,in_library)
//	}
//	return library
//}



//module.exports.library = (data,...names)=>{
//	let library = Library(data)
//	if(!library) return false
//	let mods = get_modules(library,...names)
//	return add_modules(library,...mods)
//}
//

//function get_module(path,library){
//	let mod = null
//	if(modules.has(path)){
//		let saved = modules.get(path)
//		if(saved === in_library) mod = Library.get(path,{name:library})
//		else mod = saved
//		return mod.value
//	}
//	let module_path = null
//	if(fxy.is.text(library)) {
//		module_path = fxy.join(library,path)
//		path = `${library}/${path}`
//	}
//	mod = Module(path,library,module_path)
//	if(mod.exists) {
//		if(mod.library){
//			let library = get_library(mod.library)
//			if(library) {
//				library.set(mod.name,mod)
//				modules.set(mod.name,mod)
//			}
//		}
//		else modules.set(mod.name,mod)
//	}
//	return mod.value
//}
//
//function get_modules({folder,name},...names){
//	return names.map(x=>Module(`${name}/${x}`,name,fxy.join(folder,x))).filter(mod=>mod.exists)
//}





//function get_library(folder){
//	if(fxy.is.text(folder)){
//		if(!libraries.has(folder)) libraries.set(folder,new Map())
//		return libraries.get(folder)
//	}
//	return null
//}
//
//function get_library_module(path,folder){
//	if(fxy.is.text(folder)){
//		let library = get_library(folder)
//		if(library.has(path)) return library.get(path)
//		return null
//	}
//	for(let library of libraries.values()){
//		if(library.has(path)) return library.get(path)
//	}
//	return null
//}