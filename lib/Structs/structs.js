const fxy = require('fxy')


module.exports = get_structs


function get_structs(directory){
	return fxy.tree(directory)
	          .items
	          .filter(item=>item.get('path').includes('.DS_Store') !== true)
	          .map(item=>{
	      
                  item.graph = function(main_path,graph_sub_path){
                    if(typeof graph_sub_path !== 'string') graph_sub_path = '/graph'
                    return require(this.get('path'))(`${main_path}/${this.name}${graph_sub_path}`)
                  }
                  return item
              })
}