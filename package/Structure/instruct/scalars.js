const fxy = require('fxy')
const info = require('./info').type

//exports
module.exports = {
	get resolvers(){ return get_resolvers },
	get schema(){ return get_schema }
}

//shared actions
function get_files(path){
	let files = fxy.list(path).files('js').filter(name=>!(info.scalars.index_file.includes(name)))
	return new Set(files)
}

function get_resolvers(folder){
	let scalar_path = fxy.join(folder,info.scalars.folder)
	let resolvers = []
	if(fxy.exists(scalar_path)) {
		let scalars = get_files(scalar_path)
		let output = {}
		for(let file of scalars) {
			let name = file.replace('.js','')
			output[name] = require(fxy.join(scalar_path, file))
		}
		resolvers.push(output)
	}
	return resolvers
}

function get_schema(folder){
	let file = fxy.join(folder,info.scalars.folder,info.scalars.file)
	if(fxy.exists(file)) return fxy.readFileSync(file, 'utf8')
	return ''
}

