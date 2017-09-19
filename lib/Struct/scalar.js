const fxy = require('fxy')
const { GraphQLScalarType, Kind } = require('graphql')
const ScalarType = GraphQLScalarType
const ScalarValues = ['Scalar','ScalarType','Kind','value']

class ScalarRouter{
	constructor(type,routes){
		this.type = type
		if(fxy.is.data(routes)) this.routes = routes
	}
	route(name,value,original){
		if('routes' in this) {
			if(name in this.routes) value = this.routes[name](value,original)
			if(!fxy.is.nothing(value) && 'out' in this.routes) return this.routes.out(value,fxy,original)
		}
		return value
	}
	//serialize
	get(value){
		return this.route('get', get_value(this.type,{value}),value)
	}
	//parseLiteral
	literal(ast){
		return this.route('literal', get_value(this.type,ast),ast.value)
	}
	//parseValue
	value(value) {
		return this.route('value', get_value(this.type,{value}),value)
	}
	get Type(){
		return {
			serialize:this.get.bind(this),
			parseValue:this.value.bind(this),
			parseLiteral:this.literal.bind(this)
		}
	}
}

class Scalar{
	constructor(name,type_description,routes){
		this.name = name
		Object.assign(this, get_type_description(type_description))
		Object.assign(this, new ScalarRouter(this.type,routes).Type)
	}
	get Type(){ return new ScalarType(this) }
}

//exports
module.exports = new Proxy(get_scalar_type, {
	get(o,name){
		switch(name){
			case 'Kind': return Kind
			case 'Scalar': return Scalar
			case 'ScalarType': return ScalarType
			case 'value': return get_value
		}
		if(name in o) return o[name]
		return null
	},
	has(o,name){ return ScalarValues.includes(name) }
})


//shared actions
function get_description(value,{type}){
	let description = value.replace(type,'').trim()
	if(description.charAt(0) === '-') description = description.replace('-','').trim()
	return fxy.id.capitalize(description)
}

function get_value(type,{value}){
	if(fxy.is.nothing(value)) return null
	if(type === 'any') return value
	else if(type in fxy.id && fxy.id[type](value)) return value
	else if(type in fxy.as) return fxy.as[type](value)
	return null
}

function get_name(filepath){
	if(!fxy.is.text(filepath)) throw new Error(`sxy.scalar name is not a valid text value.`)
	if(filepath.includes('.js')) return fxy.basename(filepath).replace('.js','')
	return filepath
}

function get_scalar_type(name,type_definition,router){
	return new Scalar(get_name(name),type_definition,router).Type
}

function get_type_description(value){
	let data = {}
	if(fxy.is.text(value)){
		let words = fxy.id.words(value)
		data.type = words[0].toLowerCase()
		data.description = get_description(value,data)
		if( data.type !== 'any' && !(data.type in fxy.as) ) throw new Error(`${data.type} is not a valid sxy.scalar type ${Object.keys(fxy.as)}`)
	}
	return data
}

