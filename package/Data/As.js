const fxy = require('fxy')
const AsDataType = Symbol('AsDataType')
//exports
module.exports = Base => class extends Base{
	static get [AsDataType](){ return true }
	as_data(){ return get_data(this,this.constructor.get_as_data) }
}

//shared actions
function get_data(point,get_as_data){
	let as = fxy.is.function(get_as_data) ? get_as_data(point):{names:point.keys()}
	let data = null
	if(!fxy.is.data(as.data)) data = {}
	else data = as.data
	let names = as.names
	if(names) {
		for(let name of names) {
			let value = point[name]
			if(fxy.is.data(value) && value.constructor[AsDataType]) {
				value = value.as_data()
			}
			data[name] = value
		}
	}
	return data
}