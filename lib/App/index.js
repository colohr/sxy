const wxy = require('wxy')
const folder = Symbol.for('folder')
class SxyApp extends wxy.Cloud{
	static get create(){ return create_app }
	static get get(){ return actions() }
	static get loader(){ return require('./loader') }
	static get router(){ return require('./router') }
	static get routers(){ return require('../routers') }
	static get start(){ return start_app }
	static get structs(){ return require('./structs') }
	constructor(value){ super(value) }
	start(){
		let loader = get_loader(this)
		//this.server.use(this.graphs)
		return new Promise((success,error)=>{
			loader.once('done',(structs)=>{
				let routers = get_routers(this,structs.structs_index)
				for(let item of routers) this.server.use(item.path,item.router)
				this.server.use(structs)
				return super.start().then(()=>success(this)).catch(error)
			})
			return loader.load()
		})
	}
}

//exports
module.exports = SxyApp

//shared actions
function actions(){
	return {
		graphs:get_graphs
	}
}

function create_app(value){ return new SxyApp(value) }

function get_loader(app){
	let options = app instanceof SxyApp ? app.get('sxy'):app
	options[folder] = app.folder
	return require('./loader')(options)
}

function get_router(name,options,structs){
	const routers = require('../routers')
	if(name in routers) return routers[name](options,structs)
	return null
}

function get_routers(app,index){
	let options = app instanceof SxyApp ? app.get('sxy'):app
	let routers = []
	if('routers' in options){
		let items = options.routers
		let path = items.path || '/struct'
		for(let name in items) {
			let router = get_router(name,options,index)
			if(router) routers.push({path, router})
		}
	}
	return routers
}

function start_app(value){
	console.log('\n••••••••••sxy••••••••••••')
	return create_app(value).start()
}



