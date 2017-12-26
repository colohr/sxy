const fxy = require('fxy')
const info = require('./info').type
const scalars = require('./scalars')
const web_component = require('./web-component')

//exports
module.exports = function type_export(name,folder){
	return {
		get resolvers(){ return get_resolvers(folder) },
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

//let type = this.type
//if(type && info.resolver in type) resolvers.push(type.resolver)
//resolvers = set_scalars(directory,resolvers)
//resolvers.push(scalars.resolvers(folder))
//return fxy.as.one(...resolvers)

//exports
//module.exports.class = get_type_class


//function get_scalar_files(path){
//	let files = fxy.list( path ).files('js').filter(name=>!(info.scalars.index_file.includes(name)))
//	return new Set(files)
//}
//let scalars = fxy.join(directory, info.scalars.folder, info.scalars.file)
//if(fxy.exists(scalars)) schemas.push(fxy.readFileSync(scalars, 'utf8'))
//function get_schema(){
//	let schema = fxy.join(directory,`${name}.graphql`)
//	let schemas = []
//	if(fxy.exists(schema)) schemas.push(fxy.readFileSync(schema, 'utf8'))
//	let scalars = fxy.join(directory, info.scalars.folder, info.scalars.file)
//	if(fxy.exists(scalars)) schemas.push(fxy.readFileSync(scalars, 'utf8'))
//	return schemas.join('\n')
//}

//function get_type_class(...x){
//	let class_file_path = fxy.join(...x)
//	if(!class_file_path.includes('.js')){
//		let name = x[x.length-1]
//		let class_file = name.includes('.js') ? name:info.class.replace('@',name)
//		class_file_path = fxy.join(class_file_path,class_file)
//	}
//	if(fxy.exists(class_file_path)) return require(class_file_path)
//	return null
//}



//function set_scalars(folder,resolvers){
//	let scalar_path = fxy.join(folder,info.scalars.folder)
//	if(fxy.exists(scalar_path)) {
//		let scalars = get_scalar_files(scalar_path)
//		let output = {}
//		for(let name of scalars) output[ name.replace('.js','') ] = require( fxy.join(scalar_path, name) )
//		resolvers.push( output )
//	}
//	return resolvers
//}

