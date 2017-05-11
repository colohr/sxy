
const MONGO_URL = 'mongodb://localhost:31058/kindle-publishing-graph'
const MongoClient = require('mongodb').MongoClient

const connection = Symbol.for('MongoClient connection')
const collection_name = Symbol.for('mongodb collection name')

const MongoCollection = (collection)=>{
	return new Proxy(collection,{
		get(o,n){
			switch(n){
				case 'find':
					return find(collection)
				case 'one':
					return find_one(collection)
				
			}
			if(n in o) return o[n]
			return null
		}
	})
}

class MongoDB {
	static connect(...args) {
		return new Promise((resolve,reject)=>{
			if (!MONGO_URL) return reject( new Error(`Environment variable MONGO_URL is missing.`))
			return MongoClient.connect(MONGO_URL).then(connection=>{
				MongoDB.connection = connection
				console.log('[MongoDb] connected.')
				return resolve(new MongoDB(...args))
			}).catch(err=>{
				console.error('Problems with the connection to the database.');
				return reject(err)
			})
			
		})
	}
	static get connection(){return this[connection]}
	static set connection(value){return this[connection]=value}
	static get connected() {
		return !!MongoDB.connection;
	}
	static close() {
		return MongoDB.connection && MongoDB.connection.close();
	}
	
	constructor(...options) {
		if(options.length){
			this[collection_name] = options[0]
		}
	}
	get connection(){
		if (!MongoDB.connected) throw new Error( `Data could not be accessed because MongoDB was not connected.`);
		return MongoDB.connection
	}
	collection(name) {
		if (!MongoDB.connected) throw new Error( `collection '${name}' could not be accessed because MongoDB was not connected.`);
		return MongoCollection(this.connection.collection(name || this[collection_name]))
	}
	get collections(){
		 return collection_names(this.connection)
	}
	get db(){
		return new Proxy(this.connection,{
			get(o,n){
				if(n in o) return o[n]
				return null
			}
		})
	}
	
	get source_name(){return 'mongo'}
	
	
}


module.exports = (...args)=>{ return MongoDB.connect(...args) }
module.exports.close = ()=>{return MongoDB.close()}
module.exports.Mongo = MongoDB



function collection_names(mongo_db){
	return mongo_db.listCollections().toArray()
}

function find_one(collection){
	return function(...args){
		return collection.findOne(...args)
	}
}
function find(collection){
	return function(...args){
		return collection.find(...args).toArray()
	}
}