const sxy = require('../')
class IndexItem{
	static get items(){ return get_items() }
	constructor(data){ Object.assign(this,data) }
}

//exports
module.exports = IndexItem

//shared actions
function get_items(){
	let items = []
	let index = sxy.index
	for(let name in index.items) items.push(index.items[name])
	return items
}