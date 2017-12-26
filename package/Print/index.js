const graphql = require('graphql')
const fxy = require('fxy')
const {GraphQLSchema} = graphql
module.exports = function print(value){
	if(value instanceof GraphQLSchema) return graphql.printSchema(value)
	else if(fxy.is.nothing(value)) return graphql.introspectionQuery
	return graphql.printType(value)
}