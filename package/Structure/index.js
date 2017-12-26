const instruct = require('./instruct')
const StructureLoader = require('./Loader')
//const language = require('./graph/language')

//exports
module.exports = get_structure
module.exports.Loader = StructureLoader
module.exports.template = ()=>instruct.template()

//shared actions
function get_structure(struct_options){
	struct_options.types = instruct(struct_options.info).types({
		data_types:struct_options.data_types,
		folder:struct_options.folder,
		shared:struct_options.shared
	})
	return new StructureLoader(struct_options)
}