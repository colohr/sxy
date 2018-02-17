const {is} = require('fxy')
const comment = '"""'
const directive = {
	symbol:'@',
	defaults:['deprecated','skip','include']
}

const expressions = {
	tab:new RegExp('\t','g'),
	break:new RegExp('\r','g'),
	extended_comment:new RegExp(`\n\n  """\n  `,'g')
}

const content_value = {
	action:(field,action)=>`async ${action}{
		if('${field}' in this.constructor && typeof this.constructor['${field}'] === 'function') return await this.constructor['${field}'].call(this,...x)
		return this.get('${field}') 
	}`,
	get:field=>`get ['${field}'](){ return this.get('${field}') }`,
	set:field=>`set ['${field}'](value){ return this.set('${field}',value) }`
}

//exports
module.exports = {
	get line(){
		return {
			action:content_line_action,
			get:content_line,
			valid:is_valid_line
		}
	},
	get lines(){ return content_lines },
	get open(){ return content_open },
	get split(){ return content_split },
	get type(){ return content_type }
}

//shared actions
function clear_invalid(text){
	if(text.indexOf(comment) >= 0) return clear_invalid(erase_comment())
	else if(text.indexOf(directive.symbol)>=0) return clear_invalid(erase_directives())
	else if(text.indexOf('(\n')>=0) return clear_invalid(clean_inputs())
	return text

	//shared actions
	function clean_inputs(){
		const inner_text = get_inner_text('(',')')
		return text.replace(`(${inner_text})`,'(...x)').trim()
	}

	function erase_comment(){
		const comment_text = get_comment(text)
		return replace(comment,comment_text,comment)
	}

	function erase_directives(){
		for(const name of directive.defaults){
			const start = `@${name}(`
			if(text.indexOf(start)>=0){
				const end = ')'
				const inner_text = get_inner_text(start,end)
				return replace(start,inner_text,end)
			}
		}
		return text
	}

	function get_inner_text(start,end){ return text.substring(text.lastIndexOf(start)+start.length,text.lastIndexOf(end)) }

	function replace(start,inner_text,end){ return text.replace(`${start}${inner_text}${end}`,'').trim() }
}


function content_action({field,action}){ return content_value.action(field,action) }

function content_item({field}){ return [content_value.get(field), content_value.set(field)].join('\n') }

function content_line(line){
	const is_action = line.includes('(')
	const field = get_field()
	return {
		action:is_action ? content_line_action(line):null,
		field,
		get value(){ return is_action ? content_action(this):content_item(this) }
	}

	//shared actions
	function get_field(){
		const splitter = is_action ? '(':':'
		return line.split(splitter)[0].trim()
	}
}

function content_line_action(line){
	const definition = get_definition()
	const input_text = definition.substring(definition.lastIndexOf('(')+1,definition.lastIndexOf(')'))
	if(input_text === '...x') return definition
	return definition.replace(input_text,`...x`)
	//shared action
	function get_definition(){ return `${line.split(')')[0]})`.trim() }
}



function content_lines(x){
	if(!is.text(x)) return []
	let text = content_split(content_open(x)).map(return_line).join('\n')
	text = text.replace(expressions.break,'')
	text = text.replace(expressions.tab,' ')
	return content_split(text).map(content_line)
	//shared actions
	function return_line(line){ return is_valid_line(line) ? line:'\r' }
}

function content_open(text){
	const open = text.split('{')[1]
	text = open.split('}')[0]
	return clear_invalid(text)
}

function content_split(text){ return text.split('\n').map(line=>line.trim()).filter(line=>line.length > 0) }

function content_type(map){
	const prototype = content_lines(map).map(line=>line.value)
	try{ return Type=>eval(`(Type=>class extends Type{ ${prototype.join('')} })`)(Type) }
	catch(e){
		console.error(`sxy > Utility.content.type`)
		console.dir(e,{colors:true,depth:5})
		console.log(map)
		console.dir(prototype,{colors:true,depth:5})
	}
}

function get_comment(text){
	let inner_text = ""
	if( /"""/.test(text)) inner_text = text.match( /"""(.*?)"""/ )[1]
	else inner_text = text
	return inner_text
}

function is_valid_line(line){
	if(line.indexOf('#') === 0) return false
	return true
}