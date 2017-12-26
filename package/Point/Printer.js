const sxy = require('../Module')
const fxy = require('fxy')
const Type = require('./Type')
const {printType,printSchema,introspectionQuery} = require('graphql')

//exports
module.exports = setup_printer

//shared actions
function setup_printer(router,names){
	if(!fxy.is.data(names)) names = {}
	router.get(`/${names.print || 'print'}/:api`,(request,response,next)=>{
		let input = request.params
		let name = input.api
		let value = null
		if(name === 'instruct' || name === 'introspectionQuery') value = introspectionQuery
		else value = get_type_value(name)
		//console.log(value)
		if(value) response.send(value)
		else if(next) next()
		else response.send(`${name} not found.`)
	})
	router.get(`/${names.print || 'print'}/:api/:type`,(request,response)=>{
		let input = request.params
		let name = input.api
		let type = input.type
		let value = get_type_value(name,type)
		if(value) return response.send(value)
		else response.send(`${type} not found in ${name}`)
	})
	router.get(`/${names.prints || 'prints'}/:api/:types`,(request,response)=>{
		let value = Type.input(request.params)
		console.log(value)
		return response.send(value.text('<hr>'))
	})
	router.get(`/${names.prototype || 'prototype'}/:api/:types`,(request,response)=>{
		let value = Type.input(request.params)
		let Prototype = Type.Prototype(value)
		return response.send(Prototype.script())
	})
	
	//return value
	return router
	//shared actions
	function get_type_value(name,type){
		let struct = sxy(`${name}/get`)
		let value = null
		if(struct){
			let structure = struct('struct')
			if(structure){
				let schema = structure.item.value
				let types = schema.getTypeMap()
				if(type && type in types) value = printType(types[type])
				else if(!type) value = printSchema(schema)
			}
			
		}
		return value
	}
	
}