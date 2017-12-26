const reader = {
	clean_comments(...lines){
		return lines.filter(line=>line.indexOf('#')===-1)
		            .filter(line=>line.indexOf('@')===-1)
		            .map(line=>line.trim())
		            .filter(line=>line.length)
	},
	clean_actions(content){
	
		if(content.includes('(')){
			let parts = content.split('(')[1].split(')')[0]
			content = content.replace(`(${parts})`,'#')
			let lines = this.lines(content)
			lines = this.clean_comments(...lines)
			return this.clean_actions(lines.join('\n'))
		}
		return content
	},
	content(text){
		let open = text.split('{')[1]
		return open.split('}')[0]
	},
	lines(text){ return text.split('\n').map(line=>line.trim()).filter(line=>line.length) },
	value(text){
		let lines = this.lines(text)
		lines = this.clean_comments(...lines)
		let content = this.content(lines.join('\n'))
		return this.clean_actions(content)
	}
}

//exports
module.exports = x=>reader.value(x)