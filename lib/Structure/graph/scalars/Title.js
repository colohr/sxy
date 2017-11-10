const { GraphQLScalarType, Kind } = require('graphql')
const fxy = require('fxy')

module.exports = new GraphQLScalarType({
	description: 'Converts value to text & capitalizes all words.\r* Note: Values containing html will not work',
	name: 'Title',
	structure: 'STRING',
	kind: 'STRING',
	parseValue(value) { return title(value) },
	parseLiteral(ast) {
		if(ast.kind === Kind.STRING) return title(ast.value)
		return null
	},
	serialize(value) { return title(value) }
})


function title(value){
	let text = fxy.as.text(value)
	return fxy.id.proper(text)
}