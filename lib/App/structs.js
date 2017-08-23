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
                  item.graph = function(graph_struct){
	                    let url = get_url(this.name,graph_struct)
                        return require(this.get('path'))(url)
                  }
                  return item
              })
}

function get_url(name,struct){ return fxy.source.url(struct.url,name,struct.endpoint || '/graph') }