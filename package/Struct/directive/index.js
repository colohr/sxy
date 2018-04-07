const fxy = require('fxy')
const graphql = require('graphql')
const {DirectiveLocation} = graphql
const GraphQL = require('../../index').GraphQL

const Directive = {
	Directive:create,
	GraphQL,
	graphql,
	get information(){ return require('./information') },
	inputs:get_inputs,
	Location:DirectiveLocation
}

//exports
module.exports = define_export
module.exports.exporter = get_exporter

//shared actions
function create(...x){ return new GraphQL.Directive(...x) }

function define_export(...x){ return create(get_inputs(...x)) }

function get_exporter(exporter){ return exporter( define_export, Directive ) }

function get_inputs(name,...x){
	const arrays = x.filter(i=>fxy.is.array(i))
	const type = x.filter(i=>fxy.is.data(i) && i.constructor.name.includes('GraphQL'))[0]
	let locations = arrays.filter(is_locations)[0]
	if(locations) locations = locations.map(i=>i.toUpperCase())
	const args = arrays.filter(i=>fxy.is.data((i) && !i.constructor.name.includes('GraphQL')))[0]
	const descriptions = x.filter(i=>fxy.is.text(i))
	const description = descriptions.length ? descriptions[0]:''
	const resolve = x.filter(i=>fxy.is.function(i))[0]
	console.log(args)
	const data = {name,type,locations,description,args,resolve}
	for(const field in data){
		if(fxy.is.nothing(data[field])) delete data[field]
	}
	return data
	//shared actions
	function is_locations(a){
		for(const i of a){
			if(fxy.is.text(i) && i.toUpperCase() in DirectiveLocation) return true
		}
		return false
	}
}