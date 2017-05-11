const { GraphQLScalarType, Kind } = require('graphql')
const fxy = require('fxy')

module.exports = new GraphQLScalarType({
	description: 'A human readable text value with capitalized words',
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
	let underscored = fxy.id._(text)
	return underscored.split('_').map(word=>fxy.id.capitalize(word)).join(' ')
}