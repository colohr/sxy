const { GraphQLScalarType } = require('graphql')
const fxy = require('fxy')

module.exports = new GraphQLScalarType({
	description: 'A long text value',
	name: 'Paragraph',
	structure:'TEXT',
	kind:'STRING',
	parseValue(value) {
		return fxy.as.text(value)
	},
	parseLiteral(ast) {
		return fxy.as.text(ast.value)
	},
	serialize(value) {
		return fxy.as.text(value)
	}
})


