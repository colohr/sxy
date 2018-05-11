const fxy = require('fxy')
const info = require('./info').type

//exports
module.exports = {
	get resolvers(){ return get_resolvers },
	get schema(){ return get_schema }
}

//shared actions


function get_resolvers(location){
	const scalars = fxy.tree(location).items.filter(item=>item.get('type').folder).map(get_scalar)
	const items = fxy.tree(location,...scalars).items.only
	const content = items.map(item=>item.content).join('\n')
	return items.map(get_files)
	//let scalar_path = fxy.join(folder,info.scalars.folder)
	//console.log({scalar_path})
	//let resolvers = []
	//if(fxy.exists(scalar_path)) {
	//	let scalars = get_files(scalar_path)
	//	let output = {}
	//	for(let file of scalars) {
	//		let name = file.replace('.js','')
	//		output[name] = require(fxy.join(scalar_path, file))
	//	}
	//	resolvers.push(output)
	//}
	//console.log({resolvers})
	//return resolvers
	//shared actions
	function get_scalar(item){ return fxy.join(item.name, info.scalars.folder, info.scalars.file) }
	function get_files(item){
		const folder = fxy.dirname(item.get('path'))
		const list = fxy.list(folder).files('js').filter(valid_scalar).map(scalar_type)
		return list.reduce((o,i)=>(o[i.name]=require(i.file),o),{})
		//shared actions
		function valid_scalar(name){ return content.includes(name.replace('.js','')) }
		function scalar_type(file){ return { name:file.replace('.js', ''), file:fxy.join(folder,file) } }
	}
}

function get_schema(folder){
	let file = fxy.join(folder,info.scalars.folder,info.scalars.file)
	if(fxy.exists(file)) return fxy.readFileSync(file, 'utf8')
	return ''
}

