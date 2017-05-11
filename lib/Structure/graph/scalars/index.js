const fxy = require('fxy')
const files = fxy.tree(__dirname,'js','scalars.graphql').items.only
const graphql = require('graphql')

module.exports = [
	"STRING", //String = Text | Title
	//"CHAR", //String = Letter
	"TEXT", //String = Paragraph | Html
	"INTEGER", //Int = Number
	//"BIGINT", //Int
	"FLOAT", //Float = Decimal
	//"REAL", //Float -
	//"DOUBLE", //Float -
	"DECIMAL", //Float = Decimal
	"BOOLEAN", //Boolean = TF
	"TIME", //TIME* = HH:MI:SS = Time
	"DATE", //DATETIME* = 'YYYY-MM-DD HH:mm:ss.SSS Z' = DateTime
	"DATEONLY",//DATE* = YYYY-MM-DD = Date
	//"HSTORE", //A key / value column. Only available in postgres.
	//"JSON", //A JSON string column. Only available in postgres.
	//"JSONB", //A pre-processed JSON data column. Only available in postgres.
	"NOW", //NOW* = 'YYYY-MM-DD HH:mm:ss' = Timestamp
	//"BLOB", //Binary storage. Available lengths: `tiny`, `medium`, `long`
	//"RANGE", //Only available in postgres. Range types are data types representing a range of values of some element type (called the range's subtype).
	"UUID", //ID
	"UUIDV1", //ID
	"UUIDV4", //ID
	// "VIRTUAL", //In the above code the password is stored plainly in the password field so it can be validated, but is never stored in the DB.
	"ENUM", //Enum:GraphQLEnumType
	// "ARRAY", //An array of `type`, e.g. `DataTypes.ARRAY(DataTypes.DECIMAL)`. Only available in postgres.
	// "GEOMETRY", //Only available in PostgreSQL (with PostGIS) or MySQL
	// "GEOGRAPHY" //A geography datatype represents two dimensional spacial objects in an elliptic coord system.
]

module.exports = {
	get resolvers(){ return get_resolvers() },
	get typeDefs(){ return get_type_defs() },
	get built(){ return graphql.buildSchema(this.typeDefs) },
	combine(schema){
		if('typeDefs' in schema) schema.typeDefs.unshift(this.typeDefs)
		if('resolvers' in schema) schema.resolvers = fxy.as.one(schema.resolvers,this.resolvers)
		return schema
	}
}

function get_resolvers(){
	let resolvers = {}
	files.filter(file=>file.name !== 'index.js' && file.name !== 'scalars.graphql').forEach(file=>{
		let name = file.name.replace('.js','')
		resolvers[name] = require(`./${file.name}`)
	})
	return resolvers
}

function get_type_defs(){
	return files.filter(file=>file.name == 'scalars.graphql')[0].content
}

