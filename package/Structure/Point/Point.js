const { graphql } = require('graphql')
const Signals = require('./Signals')
const signals = Symbol('signal index')
const Pointer = Base => class extends Base{
	container(signal,variables,context){ return graphql(this.schema, signal, null, context, variables) }
	get signal(){ return get_signal(this) }
	get name(){ return this.struct.name }
	get schema(){ return this.struct.get('schema') }
	
}

//exports
module.exports = Pointer

//shared actions
function get_signal(pointer){
	if(signals in pointer) return pointer[signals]
	let content = Signals.get_content(pointer.struct.folder)
	return pointer[signals] = Signals.create(pointer,content)
}