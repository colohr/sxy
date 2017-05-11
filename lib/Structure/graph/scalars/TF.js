const { GraphQLScalarType, Kind } = require('graphql')
const fxy = require('fxy')

module.exports = new GraphQLScalarType({
	description: 'A true or false value',
	name: 'TF',
	structure: 'BOOLEAN',
	kind: 'BOOLEAN',
	parseValue(value) { return true_false(value) },
	parseLiteral(ast) { return true_false(ast.value) },
	serialize(value) { return true_false(value) }
})


function true_false(value){
	if(fxy.is.TF(value)) return value
	else if(fxy.is.nothing(value)) return false
	else if(fxy.is.text(value)) return value === 'true' ? true:false
	else if(fxy.is.number(value)) return value > 0 ? true:false
	return false
}

//function decimal(value){
	//return fxy.as.float(value)
	//let underscored = fxy.id._(text)
	//return underscored.split('_').map(word=>fxy.id.capitalize(word)).join(' ')
//}