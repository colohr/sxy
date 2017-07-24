const console = require('better-console')
const fxy = require('fxy')


module.exports = get_cloud
module.exports.router = require('./router')

//shared actions
function get_cloud({ admin, firebase, graph, host, path, port, root, statics }){
	let admins = null
	if(admin) admins = require('./admin')(admin,path)
	const server = require('./server')(statics,root,admins)
	if(!graph.url) {
		graph.url = host
		if(graph.url.includes('localhost')) graph.url += ':'+port
	}
	
	const cloud = {
		get graphs(){ return require('./load')(graph) },
		hostname:host.includes('localhost') ? `${host}:${port}${path}`: fxy.join(host,path),
		listening(){
			return new Promise((success,error)=>{
				if(firebase) return initialize_firebase(root,firebase).then(success).catch(error)
				return success()
			})
		},
		get router(){
			return server.use(this.graphs)
		}
	}
	
	cloud.start = function cloud_start(){
		return new Promise((success,error)=>{
			return this.router.listen(port,()=>{
				return this.listening().then(_=>success(this.hostname)).catch(error)
			})
			//return server.use(require('./load')(graph)).listen( port, () => {
			//	let hostname = host.includes('localhost') ? `${host}:${port}${path}`: fxy.join(host,path)
			//	let urls = [ hostname ]
			//	if(firebase) return initialize_firebase(root,firebase).then(()=>success(urls.join('\n'))).catch(error)
			//	return success(urls.join('\n'))
			//})
		})
	}
	
	
	return cloud
	
	//return new Promise((success,error)=>{
	//	return server.use(require('./load')(graph)).listen( port, () => {
	//		let hostname = host.includes('localhost') ? `${host}:${port}${path}`: fxy.join(host,path)
	//		let urls = [ hostname ]
	//		if(firebase) return initialize_firebase(root,firebase).then(()=>success(urls.join('\n'))).catch(error)
	//		return success(urls.join('\n'))
	//	})
	//})
}

function initialize_firebase(app_root,firebase_info){
	let certificate_path = fxy.join(app_root,firebase_info.account)
	const admin = require('firebase-admin')
	return new Promise((success,error)=>{
		if(fxy.exists(certificate_path)){
			let service_account = require(certificate_path);
			admin.initializeApp({
				credential: admin.credential.cert(service_account),
				databaseURL: firebase_info.url
			})
			console.info(`The firebase admin account is ready for => ${firebase_info.url}`)
			console.info('------------')
			return success()
		}
		else error(new Error(`firebase certificate account json not found app.firebase object`))
	})
}

//const structs = require('../load')
//module.exports = {
//	get structs(){ return require('../Structs/index') },
//
//}