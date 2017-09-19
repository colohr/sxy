const fxy = require('fxy')
//const {merge} = require('lodash')
const info = require('./info').type

//exports
module.exports = function type_export( name, directory ){
	return {
		get resolvers(){
			let resolvers = [{}]
			let type = this.type
			if(type && info.resolver in type) resolvers.push(type.resolver)
			resolvers = set_scalars(directory,resolvers)
			return fxy.as.one(...resolvers)
		},
		get schema(){
			let schema = fxy.join(directory,`${name}.graphql`)
			let schemas = []
			if(fxy.exists(schema)) schemas.push(fxy.readFileSync(schema, 'utf8'))
			let scalars = fxy.join(directory, info.scalars.folder, info.scalars.file)
			if(fxy.exists(scalars)) schemas.push(fxy.readFileSync(scalars, 'utf8'))
			return schemas.join('\n')
		},
		get type(){
			let type_file = fxy.join(directory,`/${info.file}`)
			let has = fxy.exists(type_file) ? has_index_resolver(type_file):false
			if(has) return require(type_file)
			return null
		}
	}
}

//exports
module.exports.class = get_type_class

//shared actions
function get_scalar_files(path){
	return new Set( fxy.list( path ).files('js').filter( name => !(info.scalars.index_file.includes(name))) )
}

function get_type_class(...x){
	let class_file_path = fxy.join(...x)
	if(!class_file_path.includes('.js')){
		let name = x[x.length-1]
		let class_file = name.includes('.js') ? name:info.class.replace('@',name)
		class_file_path = fxy.join(class_file_path,class_file)
	}
	if(fxy.exists(class_file_path)) return require(class_file_path)
	return null
}

function has_index_resolver(file){
	let text = fxy.readFileSync(file,'utf8')
	if(text.includes('exports.resolver')) return true
	else if(text.includes('static get resolver()')) return true
	return false
}

function set_scalars(folder,resolvers){
	let scalar_path = fxy.join(folder,info.scalars.folder)
	if(fxy.exists(scalar_path)) {
		let scalars = get_scalar_files(scalar_path)
		let output = {}
		for(let name of scalars) output[ name.replace('.js','') ] = require( fxy.join(scalar_path, name) )
		resolvers.push( output )
	}
	return resolvers
}

