const Module = require('../../Module')
const data = {}


module.exports = new Proxy(data,{
	get(o,name){
		if(typeof name !== 'string') return null
		let value = Module(`sxy/${name}`)
		if(value === null && name in o) value = o[name]
		return value
	}
})

module.exports.create = function get_structure(index){
	let structure = require('../../Struct').struct(__dirname,{library:'sxy'})(index.structure.endpoint)
	data.index = index
	data.url = index.url
	data.structure = structure
	Module.library({name:'sxy.library',folder:__dirname})
	return structure
}