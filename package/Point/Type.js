const Schema = require('./Schema')

//exports
module.exports = new Proxy(get_type,{
	get(o,name){
		if(name in o) return o[name]
		else if(name in Schema) return Schema[name]
		else switch(name){
			case 'input': return require('./input')
		}
		return null
	}
})

//shared actions
function get_type(Type,folder){
	let typename = Type.typename || Type.name
	let type = get_type_value(typename,folder)
	return Schema.typetext(type)
}

function get_type_value(typename,folder){
	try{ return Schema(folder)[typename] }
	catch(e){ console.error(e) }
	return null
}

