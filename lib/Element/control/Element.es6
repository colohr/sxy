window.fxy.exports('type',(type,fxy)=>{
	
	const loading_element = Symbol.for('type data is loading')
	const loading_timer = Symbol('Loading timer')
	const loader_error_container = Symbol('Loader Error Container')
	
	const Error = Base => class extends Base{
		get error(){ return get_error(this) }
	}
	
	const Loader = Base => class extends Error(Base){
		get loading(){ return loading_element in this }
		set loading(value){ return set_loading(this,value) }
		get loader(){ return this[loading_element] }
	}
	
	
	//exports
	type.Loader = Loader
	type.Element = Base => class extends get_mixed_base(Base){
		load(name,...values){
			let queries = this.api.control.queries
			if(name in queries){
				let query = null
				let query_value = queries[name]
				if(fxy.is.function(query_value)) query = query_value(...values)
				else query = query_value
				this.loading=name
				return this.graph.get(query).then(data=>{
					this.loading = false
					return this.data.set(name,data)
				})
			}
			else throw new Error(`Cannot load data named: ${name}`)
		}
	}
	
	//shared actions
	function get_error(element){
		return new Proxy(element,{
			get(o,name){
				let container = get_error_container(o)
				switch(name){
					case 'container':
						return container
						break
					case 'hide':
						return ()=>{
							container.style.display = 'none'
							return o
						}
						break
					case 'show':
						return (e)=>{
							container.innerHTML = e.message
							return o
						}
						break
				}
				return null
			}
		})
	}
	
	function get_error_container(element){
		if(loader_error_container in element) return element[loader_error_container]
		return element[loader_error_container] = create_error_container()
		//shared actions
		function create_error_container(){
			let container = document.createElement('div')
			container.setAttribute('gui','')
			container.setAttribute('vertical','')
			container.setAttribute('center-center','')
			container.setAttribute('error','')
			container.setAttribute('fit','')
			container.style.background = 'whitesmoke'
			container.style.padding = '10px'
			container.style.display = 'none'
			container.style.zIndex = 99
			container.style.color = 'var(--apple)'
			let parent = 'shadowRoot' in element ? element.shadowRoot:element
			parent.appendChild(container)
			return container
		}
	}
	
	function get_mixed_base(Base){
		Base = Loader(Base)
		Base = type.Api(Base)
		Base = type.Frame(Base)
		return Base
	}
	
	function set_loading(element,value){
		if(value) start(value)
		else finish()
		return null
		// shared actions
		function clear(){
			if(loading_timer in element && typeof element[loading_timer] === 'number'){
				window.clearTimeout(element[loading_timer])
			}
			return delete element[loading_timer]
		}
		
		function create(name){
			let container = document.createElement('div')
			container.setAttribute('gui','')
			container.setAttribute('fit','')
			container.setAttribute('vertical','')
			container.setAttribute('center-center','')
			container.style.transition = 'opacity 300ms ease'
			container.style.willChange = 'opacity'
			container.style.background = 'rgb(201,200,202)'
			container.style.zIndex = '100'
			container.style.cursor = 'wait'
			
			let loader = document.createElement('div')
			let title = fxy.id.proper(name)
			loader.innerHTML = `Loading ${title}...`
			loader.style.textTransform = 'capitalize'
			loader.style.display = 'block'
			loader.style.position = 'relative'
			loader.style.fontSize = '16px'
			loader.style.color = 'rgb(101,100,102)'
			
			container.appendChild(loader)
			return container
		}
		
		function done(){
			let loader = element[loading_element]
			if(loader) loader.remove()
			return delete element[loading_element]
		}
		
		function finish(){
			if(loading() && clear()){
				element[loading_element].style.opacity = 0
				return element[loading_timer] = window.setTimeout(done,200)
			}
			return null
		}
		
		function loading(){ return loading_element in element }
		
		function start(value){
			if(value === true) value = ''
			if(loading() === false) {
				element[loading_element] = create(value)
				element.shadowRoot.appendChild(element[loading_element])
			}
			return clear()
		}
	}
	
})