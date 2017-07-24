
const fxy = require('fxy')
module.exports = function get_models(graph){ return fxy.tree(graph.folder,'js').items.only }