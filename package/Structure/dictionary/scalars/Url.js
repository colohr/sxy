const { GraphQLScalarType } = require('graphql')
const fxy = require('fxy')

//exports
module.exports = new GraphQLScalarType({
	description: 'A url for a web site or service',
	name: 'Url',
	structure: 'STRING',
	kind: 'STRING',
	parseValue(value) { return get_url(value) },
	parseLiteral(ast) { return get_url(ast.value) },
	serialize(value) { return get_url(value) }
})

//shared actions
function get_url(value){
	let text = fxy.as.text(value)
	let b_url = fxy.url(text)
	if(!b_url.protocol) b_url = fxy.url(`https://${text}`)
	return fxy.url.format(b_url)
}