const fxy = require('fxy')
const Folder = require('./folder')
const get_struct = require('./get')

//exports
module.exports = get_type
module.exports.folder = get_folder
module.exports.library = get_library
module.exports.location = get_location
module.exports.name = get_name


//shared actions
function get_folder(location){
	const type = fxy.extname(location)
	if(type) return Folder(location)
	return location
}

function get_library(type){
	try{
		const Module = require('../Module')
		return Module(`${type.folder}/get`)
	}
	catch(e){ console.error(e) }
	return name=>null
}

function get_location(location){
	if(!location) {
		if(!__dirname.includes('node_modules')) location = process.cwd()
		else location = fxy.join(__dirname,'../../../')
	}
	return location
}

function get_name(location){
	let value = null
	if(location.includes('index.js')) value = fxy.basename(Folder(location))
	else value = location.replace(fxy.extname(location),'')
	return fxy.basename(value)
}

function get_type(location){
	location = get_location(location)
	return {
		get folder(){ return get_folder(this.location) },
		get(name){ return get_library(this.location)(name) },
		location,
		get name(){ return get_name(this.location) },
		get struct(){ return get_struct(this.name) }
	}
}