//const fxy = require('fxy')
const instruct = require('./instruct')
const language = require('./graph/language')
const Graph = require('./graph/Graph')


module.exports = Structure
module.exports.Graph = Graph

class LanguageStructureGraph extends Graph{
	constructor(options){
		super(options)
		if(options.language) this.language = language(this, instruct.models(this), options.language)
		if(options.library) StructureLibrary(this,options.library)
	}
}

//{ url, folder, io, data_types}
function Structure(struct_options){
	struct_options.types = instruct.types({
		data_types:struct_options.data_types,
		folder:struct_options.folder,
		shared:struct_options.shared
	})
	//return new LanguageStructureGraph(url, instruct.types({folder, data_types}) , io)
	return new LanguageStructureGraph(struct_options)
}

function StructureLibrary(struct,name){
	let library_name = typeof name === 'string' ? name:struct.name
	return require('../Module').library({name:library_name}).graph_struct(struct)
}