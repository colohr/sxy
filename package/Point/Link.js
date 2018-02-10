const fxy = require('fxy')

class PointLink{
	constructor({folder,structs,modules}){
		this.folder = folder
		this.structs = structs
		this.modules = fxy.is.text(modules) ? modules:fxy.join(folder,'node_modules')
	}
	module(...x){ return fxy.join(this.modules,...x) }
}

//exports
module.exports = PointLink
module.exports.cloud = get_cloud_link
module.exports.create = create_link

//shared actions
function create_link(from,to){
	if(!fxy.exists(from)){
		console.error('Point.Link origin location does not exist')
		return false
	}
	if(fxy.exists(to)) return true
	fxy.symlink_sync(from,to)
	return fxy.exists(to)
}

function get_cloud_link(cloud,save_action=true){
	if(cloud.has('PointLink')) return cloud.get('PointLink')
	const options = cloud.options
	const option = options.sxy
	const setting = {folder:options.folder,structs:option.structs,modules:options.modules}
	const point_link = new PointLink(setting)
	const create_links = links=>get_links(point_link,links)
	if(save_action===false) return get_links(point_link,option.links)
	return cloud.set('PointLink',create_links).get('PointLink')
}

function get_links(point_link,links){
	const results = []
	if(fxy.is.data(links)){
		for(const struct in links){
			const list = links[struct]
			if(fxy.is.array(list)){
				for(const value of list){
					const link = module_link(point_link,struct,value)
					console.dir(link,{colors:true,depth:5})
					link.created = create_link(link.from,link.to)
					results.push(link)
				}
			}
		}
	}
	return results
}

function module_link(point_link,folder,option){
	const data = fxy.is.data(option) ? option:{from:option}
	let from_location = fxy.exists(data.from) ? data.from:null
	let to_location = fxy.exists(data.to) ? data.to:null
	let struct_name = null
	let class_name = null
	if(!from_location){
		const module_location = point_link.module(data.from)
		struct_name = fxy.basename(module_location)
		class_name = fxy.id.class(struct_name)
		const struct_folder =  fxy.join(module_location,'package/Struct')
		from_location =  fxy.exists(struct_folder) ? struct_folder:fxy.join(module_location,'package/',class_name)
	}
	else {
		struct_name = fxy.basename(from_location)
		class_name = fxy.id.class(struct_name)
	}
	if(!to_location) to_location = fxy.join(point_link.structs,folder,class_name)
	return {
		to:to_location,
		from:from_location
	}
}