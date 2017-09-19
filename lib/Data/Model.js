const fxy = require('fxy')
const Struct = require('../Struct')

class DataModel{
	static get(...x){ return new DataModel(...x)}
	constructor(folder,name){
		this.folder = folder
		this.name = name || fxy.basename(folder)
	}
	get io(){ return Struct.io(this.folder).sql }
	get db(){ return this.io.db }
	get model(){ return this.io.models[this.name] }
	create(data){
		if(fxy.is.data(data)) return this.model.create(data)
		return null
	}
}

//exports
module.exports = DataModel
