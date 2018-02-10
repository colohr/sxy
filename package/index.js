const fxy = require('fxy')
const Cloud = require('./Cloud')
const Module = require('./Module')
const Items = [
	'Struct',
	'Point',
	'Cloud',
	'Data',
	'Print',
	'Structure'
]

const sxy = new Proxy(Module,{
	get(o,name){
		if(name in o) return o[name]
		else if(name === 'cloud') return Cloud.create
		else if(name === 'print') return require('./Print')
		else if(name === 'template') return require('./Structure').Template
		else if(name === 'instruct') return require('./Structure/instruct')
		else if(name === 'get') return require('./Utility/get')
		else if(name === 'graphql') return require('graphql')
		else if(name === 'GraphQL') return get_graphql()
		return get_value(Items,name)
	},
	has(o,name){
		if(name in o) return true
		return has_value(Items,name)
	}
})

//exports
module.exports = sxy

//shared actions
function get_graphql(){
	const graphql = require('graphql')
	const tools = require('graphql-tools')
	return new Proxy({graphql,tools},{
		get(o,field){
			let value = get_graph_value(field)
			if(fxy.is.nothing(value) && fxy.is.text(field)){
				value = get_graph_value(fxy.id.medial(field))
				if(fxy.is.nothing(value)) {
					value = get_graph_value(`GraphQL${field}`)
				}
			}
			return value
		},
		has(o,field){ return field in graphql || field in tools }
	})
	//shared actions
	function get_graph_value(field){
		let value = field in graphql ? graphql[field]:null
		if(value) return value
		else if(field in tools) value = typeof tools[field] === 'function' ? tools[field].bind(tools):tools[field]
		return value
	}
}

function get_value(items,name){
	if(items.includes(name)) return require(`./${name}`)
	for(let item_name of items){
		let item = require(`./${item_name}`)
		if(name in item) return item[name]
	}
	return null
}

function has_value(items,name){
	if(items.includes(name)) return true
	for(let item_name of items){
		let item = require(`./${item_name}`)
		if(name in item) return true
	}
	return false
}
