const fxy = require('fxy')
const sxy = require('../Module')
const {content} = require('../Utility')

//exports
module.exports = get_schema
module.exports.typetext = get_typetext
module.exports.typename = get_typename
module.exports.folder = get_type_folder

//shared actions
function get_folder(folder){ return folder.replace(fxy.basename(folder),'') }

function get_schema(folder){
	if(!folder) {
		if(!__dirname.includes('node_modules')) folder = process.cwd()
		else folder = fxy.join(__dirname,'../../../')
	}
	try{
		const struct = sxy(`${folder}/get`)
		return struct('struct').item.value.getTypeMap()
	}
	catch(e){ console.error(e) }
	return null
}

function get_type_folder(x){
	let type = fxy.extname(x)
	if(type) return get_folder(x)
	return x
}

function get_typename(filename){
	let file = null
	if(filename.includes('index.js')) file = fxy.basename(get_folder(filename))
	else file = filename.replace(fxy.extname(filename),'')
	return fxy.basename(file)
}

function get_typetext(type){
	try{ return content.type(require('graphql').printType(type)) }
	catch(e){ console.error(e) }
	return ''
}