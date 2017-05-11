const { GraphQLScalarType } = require('graphql')
const fxy = require('fxy')

module.exports = new GraphQLScalarType({
	description: 'Human readable text',
	name: 'Text',
	structure:'STRING',
	kind:'STRING',
	parseValue(value) { return fxy.as.text(value) },
	parseLiteral(ast) { return fxy.as.text(ast.value) },
	serialize(value) { return fxy.as.text(value) }
})



