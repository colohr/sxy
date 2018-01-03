const Structures = new WeakMap()
const Data = new Map()
//exports
module.exports = Data
module.exports.Structures = Structures
module.exports.save = save_structure

//shared actions
function save_structure(pointer,structure){
	Structures.set(pointer,structure)
	return pointer
}