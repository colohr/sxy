const { GraphQLScalarType } = require('graphql')
const fxy = require('fxy')

//exports
module.exports = new GraphQLScalarType({
	description: 'A whole number',
	name: 'Number',
	structure: 'INTEGER',
	kind: 'INT',
	parseValue(value) {
		let n = fxy.as.number(value)
		if(!fxy.is.nothing(n)) return n
		return null
	},
	parseLiteral(ast) {
		let n = fxy.as.number(ast.value)
		if(!fxy.is.nothing(n)) return n
		return null
	},
	serialize(value) {
		let n = fxy.as.number(value)
		if(!fxy.is.nothing(n)) return n
		return null
	}
})
