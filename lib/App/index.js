const Cloud = require('./Cloud')
const console = require('better-console')
const fxy = require('fxy')


module.exports = get_app
module.exports.structs = require('./Cloud/structs')
module.exports.cloud = get_app_cloud
//shared actions

function get_app(directory){
	console.info('\n•••••••••sxy••••••••••••')
	return get_app_cloud(directory).then(app=>start_app(app))
}


function get_app_json(directory){
	let app_root =  directory || process.cwd()
	let app_json = fxy.join(app_root,'app.json')
	return new Promise((success,error)=>{
		if(fxy.exists(app_json)) return success(require(app_json))
		return create_app(app_root,app_json).then(success).catch(error)
	})
}


function get_app_cloud(directory){
	return get_app_json(directory).then(app=>{
		app.graph.structs = fxy.join(app.root,app.graph.structs)
		return Cloud(app)
	})
}

function start_app(cloud){
	
	//app.graph.structs = fxy.join(app.root,app.graph.structs)
	//app = get_directories(app)
	console.info('Starting "sxy" app','\n------------')
	return cloud.start().then(()=>{
		console.info('•••••••••••sxy••••••••••\n')
		return cloud
	})
}



function create_app(app_root,app_json){
	let app_example = require('./app.json')
	app_example.root = app_root
	console.info(`Creating default app.json file for "sxy"\n------------`)
	return fxy.json.write(app_json,app_example).then(()=>{
		console.log('created app.json')
		console.log('file: '+app_json)
		console.log(app_example)
		return app_example
	})
}



//function get_directories(app){
//	app.graph.structs = fxy.join(app.root,app.graph.structs)
//
//	return app
//}
function get_app_old(directory){
	console.info('\n•••••••••sxy••••••••••••')
	//console.info('Getting "sxy" app\n------------')
	//let app_root =  directory || process.cwd()
	//let app_json = fxy.join(app_root,'app.json')
	
	//console.info(`The app.json file for "sxy" should be in: "${app_json}"\n------------`)
	
	return new Promise((success,error)=>{
		let connect
		return get_app_cloud(directory).then(app=>{
			return start_app(app).then(success,error)
		})
		//if(fxy.exists(app_json)) connect = run_app(require(app_json))
		//else connect = create_app(app_root,app_json).then(app=>run_app(app))
		//return connect.then(success).catch(error)
	})
	
}



