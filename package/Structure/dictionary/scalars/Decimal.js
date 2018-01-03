const { GraphQLScalarType, Kind } = require('graphql')
const fxy = require('fxy')

module.exports = new GraphQLScalarType({
	description: 'A decimal number',
	name: 'Decimal',
	structure: 'DECIMAL',
	kind: 'FLOAT',
	parseValue(value) { return to_float(value) },
	parseLiteral(ast) {
		if(ast.kind === Kind.STRING) return to_float(ast.value)
		else if(ast.kind === Kind.FLOAT) return ast.value
		else if(ast.kind === Kind.INT) return to_float(ast.value)
		return null
	},
	serialize(value) { return to_float(value) }
})


function to_float(value){
	return fxy.as.number(value)
}