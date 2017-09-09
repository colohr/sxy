const Module = require('../../Module')
module.exports = {
	get data(){ return Module('sxy.library/data') },
	get url(){ return Module('sxy.library/url') },
	get structure(){ return Module('sxy.library/structure') },
	
}