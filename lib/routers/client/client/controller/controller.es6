window.fxy.exports('struct',(struct,fxy)=>{
	
	
	class Controller extends Map{
		static get Api(){ return fxy.require('google/firebase').Api }
		constructor(options){
			super(get_controller_options(options))
		}
		connect(then){ return get_connection(this).then(then) }
		get provider(){ return fxy.require('google/firebase').Api.provider(this.get('provider')) }
		get struct(){ return fxy.require('struct/load').index(this.get('name')) }
	}
	
	//load
	load()
	//exports
	struct.controller = x => new Controller(x)
	//shared actions
	function get_connection(controller){
		const api = new Controller.Api()
		return new Promise((success,error)=>{
			if(controller.user) return success(controller.user)
			const User = Controller.User
			return get_credentials(controller,api)
								.then(token=>get_actions().then(actions=>new User(token,controller,actions)))
								.then(user=>controller.user=user)
								.then(success)
								.catch(error)
		})
		//shared actions
		function get_actions(){
			return new Promise(success=>{
				if(!controller.has('actions')) return success(null)
				return fxy.require('struct/load')
				          .actions(controller.get('actions'))
				          .then(success)
			})
		}
	}
	
	function get_controller_options(options){
		if(fxy.is.text(options)) options = {name:options}
		if(!fxy.is.data(options)) options = {}
		if(!options.users) options.users = 'user-authorizations'
		return Object.keys(options).map(name=>[name,options[name]])
	}
	
	function get_credentials(controller,api){
		const tokens = get_tokens(controller,api)
		if(api.users.user) return get_user_token(api.users.user.uid)
		const provider = controller.provider
		const type = controller.has('login') ? controller.get('login'):'with_popup'
		//return value
		return api.users.sign_in[type](provider)
				  .then(result=>result.user)
				  .then(user=>get_user_token(user.uid))
		//shared actions
		function get_tokens(){ return api.database.collection[controller.get('users')] }
		function get_user_token(uid){ return tokens.value[uid].then(x=>x.value) }
	}
	
	function load(){
		fxy.require('struct/load').interface().then(Interface=>{
			Controller.User = class UserAuthorization extends Interface{
				constructor(token,controller,actions){
					const options = controller.has('options') ? controller.get('options'):{}
					if(!fxy.is.data(options.headers)) options.headers = {}
					options.headers.Authorization = `Basic: ${token}`
					super(controller.struct.endpoint,options)
					this.controller = controller
					this.actions = actions
				}
			}
		})
	}

})