const fxy = require('fxy')

//exports
module.exports = get_structs

//shared actions
function get_structs(directory){
	if(!fxy.is.text(directory) || !fxy.exists(directory)) throw new Error(`The "${directory}" for structs does not exist.`)
	return fxy.tree(directory)
	          .items
	          .filter(item=>item.get('path').includes('.DS_Store') !== true)
	          .map(item=>{
                  item.graph = function(struct,loader){
	                 if(fxy.is.nothing(loader)) return load(this,struct)
	                  let instructor = get_instructor(this)
	                  if(instructor.loaded || !instructor.ready) return loader.next()
	                  return loader.add(load(this,struct))
                  }
                  return item
              })
}

function get_url(item,struct){
	if(item.has('url')) return item.get('url')
	let url = fxy.source.url(struct.url,item.name,struct.endpoint || '/graph')
	return item.set('url',url).get('url')
}

function get_instructor(item){
	if(item.has('instructor')) return item.get('instructor')
	return item.set('instructor',require(item.get('path'))).get('instructor')
}

function load(item,struct){
	let instructor = get_instructor(item)
	let url = get_url(item,struct)
	return instructor(url)
}