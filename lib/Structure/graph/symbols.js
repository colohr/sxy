const graph = require('./index')
const ql = {
	data:Symbol.for('Query Language Data'),
	name:Symbol.for('Query Language Definition Name'),
	language:Symbol.for('Query Language Name'),
	languages:{
		graphql:{
			type: {
				fields:'_fields',
				keys:['type','ofType'],
				has_many:['GraphQLList']
			},
			types:'_typeMap',
			get language_types(){ return graph.language_types }
		}
	},
	schema:Symbol.for('Query Language Schema'),
	structs:Symbol.for('Query Language Structs'),
	types:Symbol.for('Query Language Types')
}

module.exports = ql