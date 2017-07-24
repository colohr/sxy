
const fxy = require('fxy')

const question = Symbol.for('app question')
const questions = Symbol.for('app questions')
const optional = Symbol.for('app optional')
const default_value = Symbol.for('app default value')




module.exports = get_app
function get_app(directory){
	let app_root =  directory || process.cwd()
	console.log(app_root)
	let app_json = fxy.join(app_root,'app.json')
	return new Promise((success,error)=>{
		if(fxy.exists(app_json)){
			return require(app_json)
		}
		return run_app_initializer({app_root,app_json,success,error})
	})
}

function run_app_initializer({app_root,app_json,success,error}){
	const readline = require('readline')
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
		prompt: '🍄 ⤵︎\n'
	})
	
	let app = {}
	let i = {
		model:get_app_model(app_root),
		current:0,
		get count(){ return this.questions.length },
		add(name,data,questions){},
		ask(){
			if(this.current < this.count){
				let name = this.questions[this.current]
				let question = get_question(this.current)
				return rl.question(question,(answer)=>{
					console.log(name,answer)
				})
			}
			console.log('finished app initialization')
			return rl.exit()
		},
		next(){
			this.current++;
			return this.ask();
		}
	}
	i.questions = get_questions()
	rl.prompt()
	return i.ask()
	
	function get_question(index){
		let current = i.questions[index]
		let data = i.model[current]
		if(question in data){
			return data[question]
		}
		
	}
	function get_questions(){
		let questions = Object.keys(i.model)
		return questions
	}
	function set_answer(answer){
	
	}
}

function get_app_model(app_root){
	return {
		"admin": {
			[optional]: true,
			[question]: {
				text: 'Would you like to add a admin basic auth router?',
				[default_value]:{
					"path":"ui",
					"users":{
						"user":"pass"
					}
				},
				yes: (i) => {
					return i.add('admin', {}, this[questions])
				},
				no: (i) => {
					return i.next()
				}
			},
		},
		"graph": {
			[questions]: {
				[question]:(name)=>{
					return `What is the directory or the graph ${name} folder?`
				},
				"main":{
					[default_value]:"/api"
				},
				"ui":{
					[default_value]:"/ui"
				},
				"path":{
					[default_value]:"/graph"
				},
				"structs":{
					[default_value]:"/structs"
				}
			}
		},
		"host": {
			[default_value]: 'http://localhost',
			[question]: 'What is the hostname of your app?'
		},
		"path": {
			[default_value]: '/',
			[question]: 'What is the hostname of your app?'
		},
		"port": {
			[default_value]: 7778,
			[question]: 'What is the hostname of your app?'
		},
		"root": {
			[default_value]: app_root,
			[question]: 'What is the hostname of your app?'
		},
		"statics": {
			[optional]: true,
			[question]: {
				text: 'Would you like to add a statics folder?',
				yes: (i) => {
					return i.add('statics', {}, this[questions])
				},
				no: (i) => {
					return i.next()
				}
			},
			[questions]: {
				'public': {
					[question]: {
						text: 'Enter the root directory of the main static folder: ',
						answer: (answer, i) => {
						}
					}
				}
			}
		}
	}
}



function get_value(){

}

