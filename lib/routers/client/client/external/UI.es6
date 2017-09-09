(function(get_ui){ return get_ui() })
(function(){
	const tools = {
		style:`
			.topBar .toolbar .toolbar-button{
				padding: 5px 11px 5px;
				font-size: 14px;
	            line-height: 14px;
	            border-radius: 4px;
	            box-shadow: inset 0 0 0 1px rgba(0,0,0,0.20), 0 1px 0 rgba(255,255,255, 0.7), inset 0 1px #fff;
			}
			.CodeMirror-gutters{ background: white;  }
			.graphiql-container .result-window .CodeMirror-gutters {
			    background: white;
			    border-color: rgb(224, 224, 224);
			    cursor: col-resize;
			}
			.graphiql-container .result-window .CodeMirror {
			    background: white;
			}
			.graphiql-container .variable-editor-title {
			    background: white;
	            border-bottom: 1px solid rgb(214, 214, 214);
	            border-top: 1px solid rgb(224, 224, 224);
		    }
			.graphiql-container .editorWrap .topBarWrap button,
			.graphiql-container .editorWrap .topBarWrap a{
				position: relative;
				fill: ${color('bubblegum-dark')};
				color: ${color('bubblegum-dark')};
				background: white;
			}
			.graphiql-container .docExplorerShow:before{
				border-left: 2px solid ${color('bubblegum-dark')};
	            border-top: 2px solid ${color('bubblegum-dark')};
	            top:-1.5px;
			}
			.graphiql-container .editorWrap .topBarWrap .topBar .execute-button-wrap{
				height: 24px;
			}
			.graphiql-container .editorWrap .topBarWrap .topBar .execute-button-wrap .execute-button{
				height: 24px;
				border:none;
			    box-shadow: inset 0 0 0 1px rgba(0,0,0,0.20), 0 1px 0 rgba(255,255,255, 0.7), inset 0 1px #fff;
			}
			.graphiql-container .editorWrap .topBarWrap .topBar .execute-button-wrap svg{
				position:relative;
				left:1px;
				top: -4px;
	            height: 24px;
		}`,
		queries:{
			bar: '.graphiql-container .editorWrap .topBarWrap .topBar',
			buttons: '.topBarWrap button',
			logo: '.graphiql-container .editorWrap .topBarWrap .topBar .title',
			button: '.graphiql-container .editorWrap .topBarWrap .topBar .execute-button-wrap'
		}
	}
	
	class UI{
		constructor(options){
			Object.assign(this,options)
			if(this.frame.loaded) this.ready()
			else this.frame.on('loaded',e => this.ready())
			this.frame.url = this.url
			if(this.button) this.button.onclick = e => this.toggle()
			if(this.container) this.frame.opened=true
		}
		get dom(){ return this.frame.view.contentDocument.body }
		get head(){ return this.frame.view.contentDocument.head }
		query(name){
			let query = tools.queries[name]
			return this.dom.querySelector(query)
		}
		ready(){
			this.frame.style.padding = '0'
			this.query('logo').remove()
			let button = this.query('button')
			button.style.marginLeft = '4px'
			button.style.marginRight = '0px'
			
			let style = document.createElement('style')
			style.innerHTML = tools.style
			this.head.appendChild(style)
			
			let bar = this.query('bar')
			bar.style.background = 'white'
			bar.style.padding = '0px 4px 0px'
			return this
		}
		toggle(){
			let target = 'container' in this ? this.container:this.frame
			target.opened = !target.opened
		}
	}
	
	//exports
	return get_element
	
	//shared actions
	function color(name){
		return fxy.require('design/colors').color(name).value()
	}
	function get_element(element,options){
		let ui = fxy.symbols.ui
		if(ui in element) return element[ui]
		options = !fxy.is.data(options) ? get_options(element):options
		if(options) element[ui] = new UI(options)
		return element
	}
	function get_options(element){
		let options = null
		let frame = element.query('[ui-frame]')
		if(frame){
			let index = 'struct' in element ? element.struct.index:null
			if(!index) return null
			options = {url:index.ui}
			options.frame = frame
			let button = element.query('[ui-toggle]')
			if(button) options.button = button
			let container = element.query('[ui-container]')
			if(container) options.container = container
		}
		return options
	}
	
})
