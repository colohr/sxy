const fxy = require('fxy')
const info = require('./info').type.instruct

//exports
module.exports.type = get_type
module.exports.combine = combine

//shared actions
function combine(resolvers,...list){
	if(list.length){
		const actions = get_actions(...list)
		for(let name in actions) resolvers[name] =  actions[name]
	}

	return resolvers
}

function get_actions(...list){
	let actions = list.map(get_type_action)
	return fxy.as.one(...actions)
}

function get_type(data){
	let is_type = {}
	if(info.is in data){
		is_type = data[info.is]
		delete data[info.is]
		return is_type
	}
	return is_type
}

function get_type_action(item){
	const data = {}
	for(let name in item) data[name] = { __resolveType:item[name] }
	return data
}