
const source = function(graph) {
	return {
		get api() { return require('../api') },
		get firebase(){ return require('firebase-admin') },
		get database() {
			if(graph.has('firebase')) return require('../database')(graph.get('firebase'))
			return require('../database')
		},
		get mongo() { return require('../mongo') },
		get sql() { return require('../sql')(graph) }
	}
}

module.exports = source