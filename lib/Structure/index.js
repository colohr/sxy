const instruct = require('./instruct')
const language = require('./graph/language')
const Graph = require('./graph/Graph')

class LanguageStructureGraph extends Graph{
	constructor(options){
		super(options)
		if(options.language) this.language = language(this, instruct.models(this), options.language)
	}
}

//exports
module.exports = get_structure
module.exports.Graph = LanguageStructureGraph

//shared actions
function get_structure(struct_options){
	struct_options.types = instruct.types({
		data_types:struct_options.data_types,
		folder:struct_options.folder,
		shared:struct_options.shared
	})
	return new LanguageStructureGraph(struct_options)
}

//function StructureLibrary(struct,name){
//	let library_name = typeof name === 'string' ? name:struct.name
//	return require('../Module').library({name:library_name}).graph_struct(struct)
//}