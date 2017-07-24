const fxy = require('fxy')
const { GraphQLEnumType, Kind } = require('graphql')
const EnumType = GraphQLEnumType
const Values = ['Enum','EnumType','Kind','value']

//{
//	name: 'RGB',
//		values: {
//	RED: { value: 0 },
//	GREEN: { value: 1 },
//	BLUE: { value: 2 }
//}
//}


class Enum{
	constructor(name,values){
		this.name = name
		Object.assign(this, get_values(values))
		console.log(this)
	}
	get Type(){ return new EnumType(this) }
	get Proxy(){
		
		return new Proxy(this.Type,{
			get(o,name){
				if(name in o) return o[name]
				return null
			}
		})
	}
}

module.exports = new Proxy(get_enum_type, {
	get(o,name){
		switch(name){
			case 'Enum': return Enum
			case 'EnumType': return EnumType
		}
		if(name in o) return o[name]
		return null
	},
	has(o,name){ return Values.includes(name) }
})


//shared actions
function get_description(value){
	let description = value.replace(enum_value,'').trim()
	if(description.charAt(0) === '-') description = description.replace('-','').trim()
	if(description.length) return fxy.id.capitalize(description)
	return null
}

function get_enum_type(name,...values){
	return new Enum(get_name(name),values).Type
}

function get_name(filepath){
	if(!fxy.is.text(filepath)) throw new Error(`sxy.enum name is not a valid text value.`)
	if(filepath.includes('.js')) return fxy.basename(filepath).replace('.js','')
	return filepath
}

function get_value_description(value,enum_value){
	let description = value.replace(enum_value,'').trim()
	if(description.charAt(0) === '-') description = description.replace('-','').trim()
	return fxy.id.capitalize(description)
}

function get_values(enums){
	
	let data =  {}
	if(fxy.is.text(enums)) enums = enums.split(',')
	if(fxy.is.array(enums)){
		let enum_description = null
		let enum_values = enums.filter(value=>{
			if(fxy.is.text(value)){
				value = value.trim()
				if(value.charAt(0) === '-') {
					enum_description = fxy.id.capitalize(value.replace('-','').trim())
					return false
				}
			}
			return true
		}).map((value,index)=>{
			let data = {}
			if(fxy.is.text(value)){
				let words = fxy.id.words(value)
				data.name = words[0]
				data.value = {value:index}
				data.description = get_value_description(value,data.name)
			}
			return data
		})
		
		data.values = {}
		for(let item of enum_values){
			data.values[item.name] = item.value
		}
		if(enum_description) data.description = enum_description
	}
	else if(fxy.is.data(enums)) data = enums
	
	return data
}




