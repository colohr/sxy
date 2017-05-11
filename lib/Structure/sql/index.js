const fxy = require('fxy')
const database = Symbol('Graph sqlite database')
const Sequelize = require('sequelize')

class SQLLiteDatabase{
	constructor(graph){
		this.name = graph.name
		this.path = fxy.join( graph.folder, `${graph.name}.sqlite`)
		this.db = new Sequelize(graph.name, null, null, {
			dialect: 'sqlite',
			storage: this.path
		})
		this.data_types = graph.get('types').data_types
	}
	define(name, model){
		console.log('---------------------')
		console.log('Adding sql model:',`'${name}'`,'to Sequalize')
		console.log(model)
		console.log('---------------------')
		return this.db.define(name, model,{underscored: true})
	}
	get models(){ return this.db.models }
	set_belongs_to(model){
		if(this.data_types && model.name in this.data_types){
			let data_type = this.data_types[model.name]
			if(fxy.is.array(data_type.belongs_to)){
				console.log('belongs_to:',data_type.belongs_to)
				for(let belongs of data_type.belongs_to){
					if(belongs.name in this.models) {
						this.models[belongs.name].belongsTo(this.models[model.name],{as:belongs.as})
					}
				}
			}
		}
	}
	// models.has_many = model name whether inside a GraphQL List or a value of the type - { models: [Model], model:Model }
	set_has_many(model){
		if(fxy.is.array(model.has_many)){
			console.log('has_many:',model.has_many)
			for(let many of model.has_many){
				if(many.name in this.models) {
					console.log(many)
					this.models[model.name].hasMany(this.models[many.name],{as:many.as})
				}
			}
		}
		return this.set_belongs_to(model)
	}
	set_models(structs_data){
		console.log('Setting graph language structures to sql models')
		let models = this.models //from this db.models aka Sequalize
		let structs = get_data_map(structs_data) //from graph/language.js
		for(let name in models){
			console.log('--------------------')
			console.log('Sequalize model:',name)
			//console.dir(this.models[name])
			if(structs.has(name)){
				let model = structs.get(name).model //only the model information
				console.log('Structure model:',typeof model)
				this.set_has_many(model)
			}
			console.log('--------------------')
		}
		console.dir(this.db.models.Person)
	}
}

class StructureQueryLanguage extends SQLLiteDatabase{}

module.exports = get_sqlite_data
module.exports.StructureQueryLanguage = StructureQueryLanguage

function get_data_map(data){
	if(fxy.is.map(data)) return data
	else if(fxy.is.array(data)) return new Map(data)
	else if(fxy.is.data(data)) return new Map(Object.keys(data).map(name=>[name,data[name]]))
	return new Map()
}

function get_sqlite_data(graph){
	if(graph.has(database)) return graph.get(database)
	return graph.set(database, new StructureQueryLanguage(graph)).get(database)
}
