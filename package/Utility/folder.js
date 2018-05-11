const fxy = require('fxy')
const is = {root:is_root}
const of = {structs:of_structs}
const structs = {}
//exports
module.exports = folder_name
module.exports.clean = clean
module.exports.is = is
module.exports.of = of
module.exports.shared = shared_folders
module.exports.structs = shared_struct_folders
module.exports.structs.location = location=>structs.location=location

//shared actions
function clean(folder){
	return folder.split('/')
	             .filter(part=>part.length>0)
	             .join('/')
}

function folder_name(folder){ return folder.replace(fxy.basename(folder),'') }

function is_root(folder){
	const parts = fxy.join(folder,'../').split('/').filter(part=>part.length > 0)
	return parts[parts.length - 1] === 'structs'
}

function of_structs(folder,count){
	if(!fxy.is.number(count)) count = 0
	if(count >= 20) return null
	const location = fxy.join(folder,'../')
	return is_root(folder) ? location:(count++,of_structs(location,count))
}

function shared_folders(folder){
	const structure_folder = of_structs(folder)
	return (...names)=>names.map(name=>fxy.join(structure_folder,name))
}

function shared_struct_folders(...names){
	if('location' in structs === false){
		try{ structs.location = get_sxy_struct_option()  }
		catch(e){ throw new Error('Utility.folder.structs: invalid structs location to share sxy struct') }
	}

	return names.map(name=>fxy.join(structs.location,name))

	//shared actions
	function get_sxy_struct_option(){
		try{
			const location = require(fxy.join(process.cwd(), '/app.json')).sxy.structs
			return location.indexOf(process.cwd()) === 0 ? location:fxy.join(process.cwd(),location)
		}
		catch(e){
			throw new Error('Utility.folder.structs: invalid structs location to share sxy struct')
		}
	}
}