const sxy = require('../')
const types = {
	client:{ type:'library' },
	index:{ file:'index.json', type:'data' },
	documentation:{
		type:'library'
	}
}
class IndexModule{
	static get types(){ return types }
	static get modules(){ return get_modules() }
	constructor(data){ Object.assign(this,data) }
}


//exports
module.exports = IndexModule

//shared actions
function get_modules(){
	let items = []
	let index = sxy.index
	for(let name in index.modules) items.push(index.modules[name])
	return items
}