const fxy = require('fxy')
const wxy = require('wxy')

//exports
module.exports = function cloud_router(setting){
	return function route_point(request, response){
		try{
			get_script(setting).then(script=>{
				const code = wxy.Mini.convert.code(script, {mangle: true, compress: true})
				response.set('Content-Type', 'application/javascript')
				response.send(code)
			}).catch(e=>{
				console.error(e)
				response.end(404)
			})
		}
		catch(e){
			console.error(e)
			response.end(404)
		}
	}
}

module.exports.main = get_main

//shared actions
async function get_main(){ return await fxy.read_file(fxy.join(__dirname, 'main.js'), 'utf8') }

async function get_script(setting){
	const data = setting
	data.main = await get_main()
	const content = await fxy.read_file(fxy.join(__dirname, 'script.js'), 'utf8')
	return fxy.tag.data(content, data, ['${(',')}'])
}
