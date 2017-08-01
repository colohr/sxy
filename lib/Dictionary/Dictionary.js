const fxy = require('fxy')

const graphql = require('graphql')

class Dictionary{
	constructor(folder,...inputs){
		this.folder = folder
		this.inputs = inputs
	}
	combine(schema){
		//console.log(this.types)
		if('typeDefs' in schema) schema.typeDefs.unshift(this.types)
		//console.log(schema)
		if('resolvers' in schema) schema.resolvers = fxy.as.one(schema.resolvers,this.resolvers)
		return schema
	}
	get files(){ return fxy.tree(this.folder,'graphql').items.only }
	get logic(){ return fxy.tree(this.folder,'js').items.only }
	get resolvers(){ return get_resolvers(this) }
	get schema(){ return graphql.buildSchema(this.types) }
	get types(){ return get_type_defs(this) }
}



module.exports = Dictionary

function get_resolvers(dictionary){
	let resolvers = {}
	let files = dictionary.logic
	files.filter(file=>file.name !== 'index.js').forEach(file=>{
		let name = file.name.replace('.js','')
		let Type = require(`${file.get('path')}`)
		resolvers[name] = (...x)=>new Type(...x)
	})
	files.filter(file=>file.name === 'index.js' && file.get('path') !== dictionary.folder+'/index.js').forEach(file=>{
		let path = file.get('path')
		console.log(path)
		Object.assign(resolvers,require(file.get('path'))(...dictionary.inputs))
	})
	return resolvers
}

function get_type_defs(dictionary){
	let files = dictionary.files
	return files.filter(item=>!is_scalar(item)).map(item=>item.content).join('\n')
}

function is_scalar(item){
	return item.get('path').includes('scalars/')
}