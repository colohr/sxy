//exports
module.exports = function get_router(index){
	const structure = require('../structure').create(index)
	const app_router = require('../../App/router')
	return app_router(structure)
}
