const { GraphQLScalarType } = require('graphql')
const fxy = require('fxy')

module.exports = new GraphQLScalarType({
	description: 'HTML text value',
	name: 'HTML',
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


