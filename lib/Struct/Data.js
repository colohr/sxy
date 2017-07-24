const fxy = require('fxy')

class Data{
	constructor(data){
		if(fxy.is.data(data)){
			for(let name in data){
				this[fxy.id._(name)] = data[name]
			}
		}
	}
}

class DatabaseModel{
	constructor(folder,name){
		this.folder = folder
		this.name = name || fxy.basename(folder)
	}
	get io(){ return require('./index').io(this.folder).sql }
	get db(){ return this.io.db }
	get model(){ return this.io.models[this.name] }
	create(data){
		if(fxy.is.data(data)) return this.model.create(data)
		return null
	}
}

module.exports = Data
module.exports.get = (folder,name)=>{ return new DatabaseModel(folder,name) }