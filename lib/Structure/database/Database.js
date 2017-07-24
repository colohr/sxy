


const data_path = Symbol.for('Firebase reference path')
const data_reference = Symbol.for('Firebase database reference')
const data_on = Symbol.for('Firebase database reference on action')


const get_on_value_actions = require('./actions')
const get_value_for_save = require('./value')
const get_value_snapshot = require('./snapshot')


module.exports = class Database{
	constructor(path,app){
		const base = app || require('firebase-admin')
		this[data_path] = path
		this[data_reference] = base.ref(path)
	}
	
	child(name){ return this.collection.child(name) }
	
	get collection(){ return this[data_reference] }
	
	collection_value(){
		return new Promise((success,error)=>{
			return this.collection.once('value')
			           .then(snapshot=>success(get_value_snapshot(snapshot)))
			           .catch(error)
		})
	}
	
	get on(){
		if(!this[data_on]) this[data_on] = get_on_value_actions(this)
		return this[data_on]
	}
	
	save(name, value){
		return new Promise((success,error)=>{
			return this.child(name)
			           .update(get_value_for_save(value))
			           .then(success)
			           .catch(error)
		})
	}
	
	get source_name(){return 'firebase'}
	
	value(name){
		return new Promise((success,error)=>{
			let child = this.child(name)
			return child.once('value')
			            .then(snapshot=>success(get_value_snapshot(snapshot)))
			            .catch(error)
		})
	}
	
}