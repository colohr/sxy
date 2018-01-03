const fxy = require('fxy')

class Module{
	constructor(name,library,path){
		this.name = name
		if(fxy.is.text(library)) this.library = library
		if(!fxy.is.text(path)) path = name
		this.path = fxy.is.text(path) ? path:null
	}
	get exists(){ return this.path !== null ? fxy.exists(this.path):false }
	read(type){ return this.exists ? get_module_value(this.path,type):null }
	get value(){ return this.exists ? get_module_value(this.path):null }
}

//exports
module.exports = (...x)=>new Module(...x)

//shared actions
function get_module_value(path,type){
	let ext = fxy.extname(path)
	if(ext){
		if(is_graphic(ext)) return read_graphic(path,type)
		else if(ext.includes('graphql') || ext.includes('txt') || type === "text") return fxy.readFileSync(ext,'utf8')
	}
	if(!ext || ext.includes('js') || ext.includes('es6')) return require(path)
	return null
}

function is_graphic(ext){
	if(fxy.is.text(ext) !== true) return false
	ext = ext.toLowerCase().trim()
	return ['.png','.jpg','.jpeg','.gif','.tiff'].includes(ext)
}

function read_graphic(path,type){
	if(!fxy.is.text(type)) type = 'base64'
	let ext = fxy.extname(path).replace('.','').trim()
	let value = fxy.readFileSync(path).toData(type)
	if(type === 'base64') return `data:image/${ext};base64, ${value}`
	return value
}