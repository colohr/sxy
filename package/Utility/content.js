const {is} = require('fxy')
const comment = '"""'

const directive = {
	symbol:'@',
	defaults:['deprecated','skip','include']
}

const expressions = {
	comments:get_variation_expressions(comment),
	input_open:get_variation_expressions('\\('),
	input_close:get_variation_expressions('\\)')
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
	get line(){ return { action:content_line_action, get:content_line } },
	get lines(){ return content_lines },
	get open(){ return content_open },
	get split(){ return content_split },
	get type(){ return content_type }
}

//shared actions
function clear_invalid(text){
	if(text.indexOf(comment) >= 0) return clear_invalid(erase_comment())
	else if(text.indexOf(directive.symbol)>=0) return clear_invalid(erase_directives())
	return text

	//shared actions
	function erase_comment(){
		const comment_text = get_comment(text)
		if(is.array(comment_text) && comment_text.length){
			return text.replace(comment_text[0],'').trim()
		}
		return text
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
	let text = content_open(x).trim()
	text = clear_type_line()
	//console.log(text)
	return content_split(text).map(content_line)
	//shared actions
	function clear_type_line(){
		return content_split(text).filter(filter_brackets).map(return_line).join('\n')
		//shared actions
		function filter_brackets(line){ return !(line.charAt(0) === '}' || line.charAt(line.length-1) === '{') }
		function return_line(line){ return line.indexOf('#') === 0 ? '\n':line }
	}
}

function content_open(text){
	text = erase_comments(text)
	text = trim_comment_breaks()
	text = trim_parenthesis()
	text = clear_invalid(text)
	return text
	//shared actions
	function trim_comment_breaks(){
		for(const type of expressions.comments) text = text.replace(type,' """ ')
		return clear_invalid(text)
	}
	function trim_parenthesis(){
		return text.split('(').map(clear_left_of_parenthesis).join('(')
		//shared actions
		function clear_left_of_parenthesis(part){
			return part.trim().split(')').map(part=>part.trim()).join(')')
		}
	}
}

function content_split(text){ return text.split('\n').map(line=>line.trim()).filter(line=>line.length > 0) }

function content_type(map){
	const prototype = content_lines(map).map(line=>line.value)
	//console.log({prototype})
	try{
		return eval(`(Type=>class extends Type{ 
						${prototype.join('')} 
					})`)
	}
	catch(e){
		console.error(`sxy > Utility.content.type`)
		console.dir(e,{colors:true,depth:5})
		console.log(map)
		console.dir(prototype,{colors:true,depth:5})
	}
}

function erase_comments(text){
	const comment_text = get_comment(text)
	if(is.array(comment_text) && comment_text.length){
		return erase_comments(text.replace(comment_text[0],'').trim())
	}
	return text
}

function get_comment(text){
	if( /"""/.test(text)) return text.match( /"""(.*?)"""/ )
	return null
}

function get_variation_expressions(type){
	let list = []
	for(let i=0;i<5;i++) list = list.concat(create_expression(i))
	return list
	//shared actions
	function create_expression(count){
		return [new RegExp(`${type}${" ".repeat(count)}\n`,'g'),new RegExp(`\n${" ".repeat(count)}${type}`,'g')]
	}
}

