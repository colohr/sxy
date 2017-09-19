const Database = require('./Database')
//exports
module.exports = (...x)=>new Database(...x)
module.exports.Database = Database

