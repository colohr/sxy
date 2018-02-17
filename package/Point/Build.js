const {GraphQLSchema, buildSchema, printType} = require('graphql')
const Get = require('./Get')
const Item = require('./Item')

//exports
module.exports = (input,...x)=>{
	const schema = get_schema(input)
	const item = get_item(schema, ...Get.names(...x))
	return Item.Generate(item, ...Get.mixins(...x))
}

//shared actions
function get_item(schema,...names){
	const item = {}
	const type_map = schema.getTypeMap()
	for(const name of names){
		if(name in type_map){
			item.name = name
			item.Map = printType(type_map[name])
			return item
		}
	}
	return item
}

function get_schema(input){
	if(input instanceof GraphQLSchema) return input
	return buildSchema(input)
}