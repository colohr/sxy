module.exports = {
	index(){
		const sxy = require('../')
		const index = sxy.index
		return {
			domain:index.domain,
			items:sxy.Item.items,
			modules:sxy.Module.modules,
			structure:index.structure,
			url:index.url
		}
	}
}