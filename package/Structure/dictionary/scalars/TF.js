const { GraphQLScalarType } = require('graphql')
const fxy = require('fxy')

//exports
module.exports = new GraphQLScalarType({
	description: 'A true or false value',
	name: 'TF',
	structure: 'BOOLEAN',
	kind: 'BOOLEAN',
	parseValue(value) { return true_false(value) },
	parseLiteral(ast) { return true_false(ast.value) },
	serialize(value) { return true_false(value) }
})

//shared actions
function true_false(value){
	if(fxy.is.TF(value)) return value
	else if(fxy.is.nothing(value)) return false
	else if(fxy.is.text(value)) return value === 'true'
	else if(fxy.is.number(value)) return value > 0
	return false
}