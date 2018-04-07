const fxy = require('fxy')
const info = require('./info').type
const scalars = require('./scalars')
const directives = require('./directives')
const web_component = require('./web-component')

//exports
module.exports = function type_export(name,folder){
	return {
		folder,
		get resolvers(){ return get_resolvers(folder) },
		get directives(){ return directives(folder) },
		get schema(){ return get_schema(name,folder) },
		get type(){ return get_type(folder) },
		get web_component(){ return web_component(name,folder) }
	}
}

//shared actions
function get_schema(name,folder){
	let schemas = []
	let file = fxy.join(folder,`${name}.graphql`)
	if(fxy.exists(file)) schemas.push(fxy.readFileSync(file, 'utf8'))
	schemas.push(scalars.schema(folder))
	return schemas.join('\n')
}

function get_resolvers(folder){
	let file = fxy.join(folder,`${info.resolver_file}`)
	let resolver = {}
	if(fxy.exists(file)) resolver = require(file)
	let resolvers = [resolver].concat(scalars.resolvers(folder))
	return fxy.as.one(...resolvers)
}

function get_type(folder){
	let type_file = fxy.join(folder,`/${info.file}`)
	let has = fxy.exists(type_file) ? has_index_resolver(type_file):false
	if(has) return require(type_file)
	return null
}

function has_index_resolver(file){
	let text = fxy.readFileSync(file,'utf8')
	if(text.includes('exports.resolver')) return true
	else if(text.includes('static get resolver()')) return true
	return false
}

