const fxy = require('fxy')
const Library = require('./Library')

//exports
module.exports = get_library_module
module.exports.library = define_library

//shared action
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