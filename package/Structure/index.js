const fxy = require('fxy')
const {is} = fxy
const instruct = require('./instruct')
const Structures = new WeakMap()
const Data = new Map()
Data.save = save_structure

const Pointer = {
	get Data(){ return Data },
	get folder(){ return require('./Pointer/folder') },
	get Interface(){ return require('./Pointer/Interface') },
	get pointers(){ return require('./Pointer/pointers') },
	get struct(){ return require('./Pointer/struct') },
	get storage(){ return get_storage },
	get Structures(){ return Structures }
}

//exports
module.exports = get_structure
module.exports.schema = get_structure_schema
module.exports.Pointer = Pointer
module.exports.preload = preload
module.exports.loaded = loaded
module.exports.Template = ()=>instruct.template()

//shared actions
async function save_structure(pointer, structure){ return (Structures.set(pointer, await structure),pointer) }

function get_structure_schema(structure){ return create_structure(structure.folder).schema() }

async function get_structure(struct_options){
	const setting = create_structure(struct_options.folder).setting(struct_options)
	return await require('./Loader').build(setting)
}

function get_storage(type){
	if(!('structures' in Data)) Data.structures = new Map()
	if(Data.structures.has(type)) return Data.structures.get(type)
	return Data.structures.set(type, new Map()).get(type)
}
function loaded(){
	for(const field of Data.structures.keys()) Data.structures.delete(field)
	if(Data.structures.size === 0) delete Data.structures
	return true
}

function preload(structs_folder){
	//const all = Array.from(Pointer.storage('definitions').values()).concat(default_schema)
	const locations = fxy.list(structs_folder).folders.paths.map(location=>create_structure(location).load())
	return set_schema()

	//shared actions
	function set_schema(){
		const schema = [require('./dictionary').definitions,`type Out{ sxy:TF } type In{ sxy:TF } type Push{ sxy:TF } schema{ query: Out mutation:In subscription:Push }`]

		for(const [name,value] of Pointer.storage('definitions')){
			try{ Pointer.Schema = require('graphql').buildSchema(schema.concat(value).map(on_item).join('\n')) }
			catch(e){
				console.error(`Pre-load: "${name}" ->  ${e.message}`)
			}
		}

		return locations

		//shared actions
		function on_item(item){
			if(fxy.is.array(item)) return item.join('\n')
			else if(fxy.is.text(item)) return item
			throw new Error(`Schema definitions is not text`)
		}
	}
}

function create_structure(location){
	const Schemas = Pointer.storage('schemas')
	const Information = Pointer.storage('information')
	const Instructions = Pointer.storage('instructions')
	if(!Information.has(location)) Information.set(location, {})
	if(!Instructions.has(location)) Instructions.set(location, [])
	if(!Schemas.has(location)) Schemas.set(location, {})

	//exports
	return {
		load(){ return read_definitions() },
		setting(options){ return define_setting(options) },
		schema(){ return read_schema() }
	}

	//shared actions

	function define_setting(options){
		const shared = 'shared' in options ? (Array.isArray(options.shared) ? options.shared:[options.shared]):null
		options.types = Object.assign(Information.get(location), { data_types: options.data_types,  folder: options.folder,  shared })
		return Instructions.get(location).options = options
	}

	function read_definitions(){
		const Definitions = Pointer.storage('definitions')
		if(Definitions.has(location)) return location
		const names = fxy.list(location).folders
		const list = new Set(names.map(on_item))

		//exports
		return (Definitions.set(location, Array.from(list)), location)

		//shared actions
		function on_item(name){
			const info = instruct.information.definition
			const folder = fxy.join(location, name)
			const items = [instruct.scalars.schema(folder)]

			//exports
			return read_file().join('\n')

			//shared actions
			function read_file(){
				const filename = get_filename()
				if(!filename) return items
				const file = fxy.join(folder, filename)
				const content = fxy.read_file_sync(file, 'utf8')
				if(name === 'Instruct') Instructions.get(location).push(content)
				else items.push(content)
				return items
				//shared actions
				function get_filename(){
					const files = fxy.list(folder).files(info.file).concat(fxy.list(folder).files(`${name}.graphql`))
					return files[0] ? files[0]:null
				}
			}
		}
	}

	function read_schema(){
		const information = Information.get(location)
		const setting = instruct.setting(information, Instructions.get(location).options)
		const schema = Schemas.get(information.folder)
		schema.typeDefs = Array.from(new Set(read_definitions()))
		schema.resolvers = read_resolvers(information)
		return Object.assign(schema, setting)

		//shared actions
		function read_definitions(){
			const Definitions = Pointer.storage('definitions')
			const shared = is.array(information.shared) ? information.shared:[]
			const definitions = shared.map(folder=>Definitions.get(folder)).map(on_item)
			return Definitions.get(information.folder).concat(definitions).concat(Instructions.get(information.folder))
			//shared actions
			function on_item(item){ return is.array(item) ? item.join('\n'):item }
		}

	}

	function read_resolvers(information){
		const Resolvers = Pointer.storage('resolvers')

		//exports
		return get_resolver()

		//shared actions
		function get_resolver(){
			const value = instruct.resolvers(get_resolvers(information.folder), information.folder)
			Resolvers.set(information.folder, value)
			const base = fxy.as.one(Resolvers.get(information.folder), {})
			const shared = information.shared ? information.shared.map(item=>Resolvers.get(item)):null
			if(shared) return set_resolvers(base, fxy.as.one(...shared))
			return base
		}

		function get_resolvers(folder){
			const file = fxy.join(folder, `${instruct.information.resolver.file}`)
			const resolver = fxy.exists(file) ? require(file):{}
			const scalars = instruct.scalars.resolvers(folder)
			return fxy.as.one(...[resolver].concat(scalars))
		}

		function set_resolvers(resolvers, shared){
			for(const name in shared){
				if(['Out', 'In', 'Push'].includes(name) === false){
					if(name in resolvers) resolvers[name] = fxy.as.one(shared[name], resolvers[name])
					else resolvers[name] = shared[name]
				}
			}
			return resolvers
		}
	}

}