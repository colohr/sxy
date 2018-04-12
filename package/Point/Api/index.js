const fxy = require('fxy')

//exports
module.exports = function get_cloud_signals(cloud){
	const setting = get_setting(cloud)
	require('../../Structure').Pointer.Api = {
		resolvers:{
			Out: {
				async Points(){
					return {
						get Site(){ return require('./Site') },
						async Signals(){ return await get_signals(setting) },
						get url(){ return setting.url }
					}
				}
			}
		},
		get definitions(){ return  fxy.read_file(fxy.join(__dirname,'Points.graphql'),'utf8') }
	}
	return setting
}
module.exports.router = function get_cloud_signals_router(cloud){
	return require('./Point')(get_setting(cloud))
}

//shared actions
function get_setting(cloud){
	const setting = cloud.options.sxy
	const {is} = fxy
	let option = is.text(setting.api) ? {file: setting.api}:setting.api
	if(!is.data(option)) option = {}
	if(!('file' in option)) option.file = 'name' in option ? option.name:'point.js'
	if(!('name' in option)) option.name = option.file.replace(fxy.extname(option.file),'')
	if(option.file.includes('.') === false) option.file += '.js'
	if(!('url' in option)) option.url = fxy.source.url(cloud.url, option.file)
	if(!('endpoint' in option) || !option.endpoint.includes(cloud.url)) option.endpoint = fxy.source.url(cloud.url, setting.path, option.endpoint || option.name, setting.endpoint)
	if(!('folder' in option))  option.folder = setting.structs
	return option
}

async function get_signals(setting){
	return new Promise(success=>{
		let items = null
		return process.nextTick(next)
		//shared actions
		function next(){
			if(!items) {
				items = fxy.tree(setting.folder, 'shared.signals.graphql', 'signals.graphql').items.only
				items.content = []
			}
			for(const item of items){
				items.splice(0, 1)
				return process.nextTick(()=>{
					items.content.push(item.content)
					return next()
				})
			}
			return (success(items.content.join('\n')), items=null)
		}
	})

}
