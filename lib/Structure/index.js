const instruct = require('./instruct')
const language = require('./graph/language')
const Graph = require('./graph/Graph')

class LanguageStructureGraph extends Graph{
	constructor(options){
		super(options)
		for(let name in options){
			switch(name){
				case 'language':
					this.language = language(this, instruct.models(this), options.language)
					break
				default:
					if(!(name in this))  {
						let value = options[name]
						if(typeof value === 'function') this[name] = value.bind(this)
						else this[name] = value
					}
					break
			}
		}
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