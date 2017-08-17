//const Cloud = require('./Cloud')
//const console = require('better-console')
const fxy = require('fxy')
const wxy = require('wxy')
const firebase = require('./firebase')
const sxy_app_graphs = Symbol('sxy app graphs')

class SxyApp{
	constructor(value){
		
		this.json = get_json(value)
		if(this.json === null) throw new Error('Invalid json setup for SxyApp')
		let folder = fxy.is.text(value) && value.includes('.json') ? fxy.dirname(value):value
		if(!fxy.is.text(folder)) folder = fxy.resolve(this.json.root || this.json.folder)
		this.folder = folder
		if(fxy.exists(this.folder) !== true) throw new Error('Invalid folder for SxyApp')
		this.cloud = wxy(this.folder)
		this.json.graph.structs = fxy.join(this.folder,this.json.graph.structs)
		if(!this.json.graph.url) {
			this.json.graph.url = this.json.host
			if(this.json.graph.url.includes('localhost')) this.json.graph.url += ':'+this.json.port
		}
	}
	get graphs(){
		if(sxy_app_graphs in this) return this[sxy_app_graphs]
		return this[sxy_app_graphs] = require('./load')(this.json.graph)
	}
	get hostname(){
		let host = this.json.host
		let path = this.json.path
		return this.json.host.includes('localhost') ? `${host}:${this.json.port}${path}`: fxy.join(host,path)
	}
	start(){
		this.cloud.server.use(this.graphs)
		return new Promise((success,error)=>{
			return this.cloud.start().then(()=>{
				return success(this)
				if(this.json.firebase) return firebase(this.folder,this.json.firebase).then(_=>success(this)).catch(error)
				return success(this)
			}).catch(error)
		})
	}
	get router(){
		return this.cloud
	}
}

//exports
module.exports = get_app
module.exports.App = SxyApp
module.exports.structs = require('./structs')
module.exports.cloud = (...x)=>new SxyApp(...x)

//shared actions
function get_app(value){
	console.log('\n•••••••••sxy••••••••••••')
	let app = new SxyApp(value)
	console.log('\tStarting "sxy" app','\n------------')
	return app.start()
}

function get_json(value){
	if(fxy.is.data(value)) return value
	if(fxy.is.text(value)){
		let json_path = value.includes('.json') ? value:fxy.join(value,'app.json')
		if(fxy.exists(json_path)) return require(json_path)
	}
	return null
}
//function get_app_json(directory){
//	let app_root =  directory || process.cwd()
//	let app_json = fxy.join(app_root,'app.json')
//	return new Promise((success,error)=>{
//		if(fxy.exists(app_json)) return success(require(app_json))
//		return create_app(app_root,app_json).then(success).catch(error)
//	})
//}

//function get_app_cloud(directory){
//	return get_app_json(directory).then(app=>{
//		app.graph.structs = fxy.join(app.root,app.graph.structs)
//		return Cloud(app)
//	})
//}

//function start_app(cloud){
//	console.info('Starting "sxy" app','\n------------')
//	return cloud.start().then(()=>{
//		console.info('•••••••••••sxy••••••••••\n')
//		return cloud
//	})
//}
