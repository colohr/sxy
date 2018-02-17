const Struct = require('../../../Struct')
const {is} = require('fxy')
//exports
module.exports = Struct.scalar('Any',`any-Any type of value that is usable when returned in JSON result.
Values that return null are:
	- undefined
	- NaN
	- Symbol
	
Types that will return a different value than the originating value are:
	- function => function.toString()
	- JSON text => JSON.parse(text) || text
	- Map => map.constructor.name === 'Map' ? Array.from(map):map
	- Set => set.constructor.name === 'Set : Array.from(set):set
	- Array => [Any]
	* Object values are not checked only values in arrays.
	
All other values return as defined in their prototype.
 
`,{
	get:get_value,
	literal:get_value,
	value:get_value
})

//shared actions
function get_returning_array(array){ return array.map(get_returning_value) }

function get_returning_object(value){
	if(is.map(value) && value.constructor.name === 'Map'){
		return get_returning_array(Array.from(value))
	}
	else if(is.set(value) && value.constructor.name === 'Set'){
		return get_returning_array(Array.from(value))
	}
	else if(is.array(value)){
		return get_returning_array(value)
	}
	return value
}

function get_returning_value(value){
	if(is_null_value(value)) return null
	else if(is.object(value)) return get_returning_object(value)
	else if(is.function(value)) return value.toString()
	else if(is.text(value) && is.json(value)){
		try{ return JSON.parse(value) }
		catch(e){ return value }
	}
	return value
}

function get_value(value){
	return get_returning_value(value)
}

function is_null_value(value){
	return is.nothing(value) || is.error(value) || is.symbol(value)
}