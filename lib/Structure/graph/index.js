const graphql = require('graphql')
const Name = 'GraphQL'
const Kind = graphql.Kind
const scalars = require('./scalars')
const sqls = require('../sql/types')

class Type{
	constructor(name){
		this.value = graphql[name]
		this.name = name
		this.id = name.replace(Name,'')
	}
	is(type){return type === this.value}
}
Type.list = new Map(get_types())


const graph = new Proxy({
	get kinds(){ return get_kinds() },
	get language_types(){ return get_language_types() },
	get names(){ return get_names() },
	get scalars(){ return get_scalars() },
	get types(){ return get_types() }
},{
	get(o,name){
		if(name in Kind) return Kind[name]
		else if(name in o) return o[name]
		else if(Type.list.has(name)) return Type.list.get(name)
		else if(name in graphql) return graphql[name]
		return null
	}
})

module.exports = graph



function get_kinds(){ return Object.keys(Kind) }

function get_language_types(){
	let resolvers = scalars.resolvers
	return Object.keys(resolvers).map(name=>{
		return [name,resolvers[name]._scalarConfig]
	})
}



function get_names(){ return Object.keys(graphql) }

function get_scalars(){ return scalars }

function get_types(){ return get_names().filter( name => name.includes(Name) ).map(name=>[name.replace(Name,''),new Type(name)]) }


