const { GraphQLScalarType, Kind } = require('graphql')
const fxy = require('fxy')

//exports
module.exports = new GraphQLScalarType({
	description: 'A decimal number',
	kind: 'FLOAT',
	name: 'Decimal',
	parseLiteral(ast){ return parse(ast) },
	parseValue(value){ return to_float(value) },
	serialize(value){ return to_float(value) },
	structure: 'DECIMAL'
})

//shared actions
function parse(ast){
	if(ast.kind === Kind.STRING) return to_float(ast.value)
	else if(ast.kind === Kind.FLOAT) return ast.value
	else if(ast.kind === Kind.INT) return to_float(ast.value)
	return null
}
function to_float(value){ return fxy.as.number(value) }
