const fxy = require('fxy')
const {GraphQLDirective} = require('graphql')
const info = require('./info').type
const Directive = require('../../Struct/directive')

//exports
module.exports = get_directives

//shared actions
function get_directives(folder){
	const location = fxy.join(folder,info.directives.folder)
	const directives = []
	if(fxy.exists(location)) {
		const files = get_files(location)
		const output = {}
		for(const file of files) {
			const name = file.replace('.js','')
			const directive = get_directive(require(fxy.join(location, file)))
			if(directive) output[name] = directive
		}
		directives.push(output)
	}
	return fxy.as.one({},...directives)
}

function get_files(path){
	let files = fxy.list(path)
	               .files('js')
	               .filter(name=>!(info.directives.index_file.includes(name)))
	return new Set(files)
}

function get_directive(directive){
	if(directive instanceof GraphQLDirective) return directive
	else if(fxy.is.function(directive)) directive = Directive.exporter(directive)
	return directive
}

