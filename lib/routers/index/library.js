const express = require('express')
const fxy = require('fxy')
const element_path = fxy.join(__dirname,'../../Element')

module.exports = get_element

//shared actions
function get_element(site){
	site.router.use(site.library,express.static(element_path))
	return site
}

