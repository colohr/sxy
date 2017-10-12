const wxy = require('wxy')
const folder = Symbol.for('folder')
const AppIndex = require('./AppIndex')
class SxyApp extends wxy.Cloud{
	static get create(){ return create_app }
	static get get(){ return actions() }
	static get loader(){ return require('./loader') }
	static get router(){ return require('./router') }
	static get start(){ return start_app }
	static get structs(){ return require('./structs') }
	constructor(value){ super(value) }
	start(){
		let loader = get_loader(this)
		return new Promise((success,error)=>{
			loader.once('done',(structs)=>{
				this.struct_index = new AppIndex(this.options,structs.structs_index)
				this.server.use(get_index_router(this.struct_index))
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

function get_index_router(index){
	const router = wxy.router()
	router.use(index.file,(request,response)=>response.json(index))
	return router
}

function start_app(value){
	console.log('\n••••••••••sxy••••••••••••')
	return create_app(value).start()
}





