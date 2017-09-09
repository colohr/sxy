const wxy = require('wxy')

class SxyApp extends wxy.Cloud{
	static get create(){ return create_app }
	static get get(){ return actions() }
	static get router(){ return require('./router') }
	static get start(){ return start_app }
	static get structs(){ return require('./structs') }
	constructor(value){
		super(value)
		this.graphs = get_graphs(this)
		let routers = get_routers(this)
		for(let item of routers) this.server.use(item.path,item.router)
	}
	start(){
		this.server.use(this.graphs)
		return new Promise((success,error)=>{
			return super.start().then(()=>success(this)).catch(error)
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

function get_graphs(app){
	let options = app instanceof SxyApp ? app.get('sxy'):app
	return require('./load')(options)
}

function get_router(name,options,structs){
	const routers = require('../routers')
	if(name in routers) return routers[name](options,structs)
	return null
}

function get_routers(app){
	let options = app.get('sxy')
	let routers = []
	if('routers' in options){
		let items = options.routers
		let path = items.path || '/struct'
		let structs = app.graphs.structs_index
		for(let name in items) {
			let router = get_router(name,options,structs)
			if(router) routers.push({path, router})
		}
	}
	return routers
}

function start_app(value){
	console.log('\n••••••••••sxy••••••••••••')
	return create_app(value).start()
}



