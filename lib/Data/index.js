const fxy = require('fxy')

class Data{
	static get define(){ return define_data }
	static get Model(){ return require('./Model') }
	static get refine(){ return refine_data }
	constructor(data){
		define_data(this,data,this.constructor.refine_type)
	}
}

//exports
module.exports = Data

//shared actions
function define_data(owner,data,type){
	if(fxy.is.data(data)) Object.assign(owner,refine_data(data,type))
	return owner
}

function refine_data(data,type){
	type = fxy.is.text(type) ? type:'underscore'
	if(type in fxy.id){
		let output = {}
		for(let name in data) output[fxy.id[type](name)] = data[name]
		return output
	}
	return data
}