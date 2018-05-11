(environment=>{
	//load
	return load_data().then(point=>('dispatchEvent' in environment && '${(name)}' in environment === false ? environment.dispatchEvent(new CustomEvent('${(name)}', {bubbles: true, detail: environment['${(name)}'] = point})):null, point))
	//shared actions
	${(main)}
})(this)