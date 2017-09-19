const database = require('../database')
const source = function(graph) {
	return {
		get api() { return require('../api') },
		get database() {
			if(graph.has('database')) return graph.get('database')
			return database
		},
		set database(controller){
			if(controller instanceof database.Database) graph.set('database',controller)
			return graph.set('database',database(controller))
		},
		get mongo() { return require('../mongo') },
		get sql() { return require('../sql')(graph) }
	}
}

//exports
module.exports = source