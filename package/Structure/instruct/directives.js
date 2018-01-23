const fxy = require('fxy')
const info = require('./info').type

//exports
module.exports = get_directives

//shared actions
function get_directives(folder){
	const location = fxy.join(folder,info.directives.folder)
	const resolvers = []
	if(fxy.exists(location)) {
		const directives = get_files(location)
		const output = {}
		for(const file of directives) {
			const name = file.replace('.js','')
			output[name] = require(fxy.join(location, file))
		}
		resolvers.push(output)
	}
	return resolvers
}

function get_files(path){
	let files = fxy.list(path)
	               .files('js')
	               .filter(name=>!(info.directives.index_file.includes(name)))
	return new Set(files)
}