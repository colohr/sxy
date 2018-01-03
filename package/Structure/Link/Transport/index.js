const { createServer } = require('http')
const { execute, subscribe } = require('graphql')
const { SubscriptionServer } =  require('subscriptions-transport-ws')
const transport = Symbol('Linker WebSocket Subscription Server')

//exports
module.exports = get_transport

//shared actions
function create_transport(){
	const Transport = {
		get subscriptions(){ return require('./subscriptions')(this) }
	}
	Transport.start = get_starter(Transport)
	return Transport
}

function get_server(server,{path,schema}){
	console.log(path,schema)
	return new SubscriptionServer({
		execute,
		subscribe,
		schema
	}, {
		server,
		path
	})
}

function get_starter(Transport){
	return ({path,port,schema})=>{
		return new Promise(success=>{
			if(Transport.server) return success(Transport)
			Transport.http = createServer(http_request)
			Transport.server = get_server(Transport.http,{path,schema})
			return Transport.http.listen(port,()=>success(Transport))
		})
	}
}

function get_transport(linker){
	if(transport in linker) return linker[transport]
	return linker[transport] = create_transport(linker)
}

function http_request(request,response){
	response.writeHead(404)
	response.end()
}