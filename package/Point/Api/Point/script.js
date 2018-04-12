((environment)=>{
	//load
	load_data().then(point=>{
		if('dispatchEvent' in environment){
			const event = new CustomEvent('${(name)}',{bubbles:true,detail:environment['${(name)}'] = point})
			environment.dispatchEvent(event)
		}
	})
	//shared actions
	${(main)}
})(this)