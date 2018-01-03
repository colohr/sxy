const Module = require('../Module')
//exports
module.exports = get_struct

//shared actions
function get_struct(name){
	const library = Module(`${name}/get`)
	if(library){
		const struct = library('structure')
		if(struct) return struct.item
	}
	return null
}