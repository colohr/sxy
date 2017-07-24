const fxy = require('fxy')
const {merge} = require('lodash')
const info = require('./info').type

module.exports = function type_export( name, directory ){
	return {
		get resolvers(){
			let resolvers = [{}]
			let type = this.type
			if(type && info.resolver in type) resolvers.push( type.resolver )
			resolvers = set_scalars(directory,resolvers)
			return merge(...resolvers)
		},
		get schema(){
			let schemas = [ fxy.readFileSync( fxy.join(directory,`${name}.graphql`), 'utf8' ) ]
			let scalars = fxy.join( directory, info.scalars.folder, info.scalars.file )
			if(fxy.exists(scalars)) schemas.push( fxy.readFileSync( scalars, 'utf8') )
			return schemas.join('\n')
		},
		get type(){
			let type_file = fxy.join(directory,`/${info.file}`)
			if(fxy.exists(type_file)) return require(type_file)
			return null
		}
	}
}
module.exports.class = get_type_class


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

function get_scalar_files(path){
	return new Set( fxy.ls( path ).files('js').filter( name => !(info.scalars.index_file.includes(name))) )
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

