const wxy = require('wxy')
const folder = Symbol.for('folder')
const AppIndex = require('./AppIndex')

class SxyCloud extends wxy.Cloud{
	static get create(){ return create }
	static get loader(){ return require('./loader') }
	static get router(){ return require('./router') }
	static get start(){ return start }
	static get structs(){ return require('./structs') }
	constructor(app_options){ super(app_options) }
	get link(){ return require('../Point/Link').cloud(this) }
	start(){
		if(this.options.sxy.links) require('../Point/Link').cloud(this,false)
		const loader = get_loader(this)
		return new Promise(async (success,error)=>{
			loader.once('done',(structs)=>{
				this.struct_index = new AppIndex(this.options,structs.structs_index)
				this.server.use(get_index_router(this.struct_index))
				this.server.use(structs)
				return super.start().then(()=>success(this)).catch(error)
			})
			return await loader.load()
		})
	}
}

//exports
module.exports = SxyCloud

//shared actions
function create(value){ return new SxyCloud(value) }

function get_loader(cloud){
	const options = cloud instanceof SxyCloud ? cloud.options.sxy:cloud
	options[folder] = cloud.folder
	return require('./loader')(options)
}

function get_index_router(index){
	const router = wxy.router()
	router.use(index.file,(request,response)=>response.json(index))
	return router
}

function start(app_options){ return create(app_options).start() }