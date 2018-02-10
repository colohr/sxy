const fxy = require('fxy')
const Point = require('./Item')

//exports
module.exports = function PointModule(item,...x){
	const location = shared_point_file_location(item)
	return Point(location,...x)
}

//shared actions
function get_class_name(filename){
	const folder = fxy.basename(fxy.join(fxy.basename(fxy.dirname(filename)),'../../'))
	return fxy.id.class(folder)
}

function shared_point_file_location(item){
	item.folder = shared_point_folder_name(item)
	//console.log(item.folder)
	const structs = shared_point_structs(item)
	if(structs){
		const name = fxy.basename(item.__filename)
		const file = fxy.join(item.folder,name)
		try{
			const items = fxy.tree(structs,file).items.only
			const target = items[0]
			if(target) return target.get('path')
		}
		catch(e){ console.error(e) }
	}
	return item.__filename
}

function shared_point_folder_name(item){
	const filename = item.__filename
	const file = fxy.basename(filename)
	let name = null
	if(fxy.is.text(item.folder)) name = item.folder
	if(file === 'index.js' && !fxy.is.text(name)) name = get_class_name(filename)
	if(!fxy.is.text(name)) name = '/'
	return name
}

function shared_point_structs(item){
	const working_directory = item.process.env.PWD
	const json_file = fxy.join(working_directory,'app.json')
	if(fxy.exists(json_file)){
		const json = fxy.json.read_sync(json_file)
		const structs = json.sxy.structs
		return fxy.join(working_directory,structs)
	}
	return null
}

