const fxy = require('fxy')

//exports
module.exports = get_structs

//shared actions
function get_structs(directory){
	if(!fxy.is.text(directory) || !fxy.exists(directory)) throw new Error(`The "${directory}" for structs does not exist.`)
	//fxy.tree(directory).items
	const items = preload(directory)
	return items.map(item=>{
                  item.graph = function(struct,loader){
                  	if(fxy.is.nothing(loader)) return load(this, struct).then(x=>loader.add(x)).catch(e=>on_error(e, this))
					const instructor = get_instructor(this)
					if(instructor.loaded || !instructor.ready) return loader.next()
					return load(this, struct).then(x=>loader.add(x)).catch(e=>on_error(e,this))
                  }
                  return item
              })
}

function on_error(e,struct){
	console.error(`Cloud/structs error: "${struct.name}"`)
	console.error(e)
	console.error('------------------\n')
}

function preload(folder){
	return require('../Structure').preload(folder).map(item=>fxy.read_item(item))
}

function get_url(item,struct){
	if(item.has('url')) return item.get('url')
	const url = fxy.source.url(struct.url,item.name,struct.endpoint || '/graph')
	return item.set('url',url).get('url')
}

function get_instructor(item){
	if(item.has('instructor')) return item.get('instructor')
	return item.set('instructor',require(item.get('path'))).get('instructor')
}

function load(item,struct){
	const instructor = get_instructor(item)
	const url = get_url(item,struct)
	return instructor(url)
}