const instruct = require('./instruct')
const StructureLoader = require('./Loader')

//exports
module.exports = get_structure
module.exports.Loader = StructureLoader
module.exports.Template = ()=>instruct.template()

//shared actions
async function get_structure(struct_options){
	struct_options.types = instruct(struct_options.info).types({
		data_types:struct_options.data_types,
		folder:struct_options.folder,
		shared:struct_options.shared
	}, struct_options)
	return await StructureLoader.build(struct_options)
	//return new StructureLoader(struct_options)
}