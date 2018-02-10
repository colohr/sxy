const { GraphQLScalarType } = require('graphql')
const fxy = require('fxy')
const moment = require('moment-timezone')
const default_timezone = "America/Chicago"

class DateType{
	constructor({ description, formats, kind, name, structure, timezone }){
		this.formats = formats || ['YYYY-MM-DD','MM/DD/YYYY']
		this.kind = kind || 'STRING'
		this.name = name || null
		this.structure = structure || 'DATE'
		this.timezone = timezone || moment.tz.guess() || default_timezone
		this.description = get_description(this,description)
	}
	get as(){ return fxy.as }
	get graph_type(){
		return new GraphQLScalarType({
			description: this.description,
			name: this.name,
			structure: this.structure,
			kind: this.kind,
			parseValue:this.parseValue.bind(this),
			parseLiteral:this.parseLiteral.bind(this),
			serialize:this.serialize.bind(this)
		})
	}
	get is(){ return fxy.is }
	get moment(){ return moment }
	parseValue(value) {
		if('pre' in this) value = this.pre(value,this)
		if(fxy.is.nothing(value)) return null
		let m = moment(value).tz(this.timezone).format(this.formats[1])
		if('parse' in this) return this.parse(m,value,this)
		return m
	}
	parseLiteral({value}) {
		
		if('pre' in this) value = this.pre(value,this)
		if(fxy.is.nothing(value)) return null
		let m = moment(value).tz(this.timezone).format(this.formats[1])
		if('parse' in this) return this.parse(m,value,this)
		return m
	}
	serialize(value) {
		if('pre' in this) value = this.pre(value,this)
		if(fxy.is.nothing(value)) return null
		let m = moment(value).tz(this.timezone).format(this.formats[1])
		
		if('parse' in this) return this.parse(m,value,this)
		return m
	}
	
}

//exports
module.exports = DateType

//shared actions
function get_description(date,description){
	if(fxy.is.text(description)) description = `* ${description}`
	else description = ''
	return `Formats any date value
	- output -> ${date.formats[1]}
	- timezone -> ${date.timezone}
	- GraphQL Kind -> ${date.kind}
	${description}
	`
}