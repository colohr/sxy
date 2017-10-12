const fxy = require('fxy')

//exports
module.exports = get_models

//exports
function get_models(graph){
	return fxy.tree(graph.folder,'js').items.only
}