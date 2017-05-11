const cheerio = require('cheerio')
module.exports = get_dom

function get_dom(html_string){
	return cheerio.load(html_string)
}