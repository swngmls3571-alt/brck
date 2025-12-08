const mariadb = require('mariadb')

const project = mariadb.createPool({
    host: 'localhost',
    port: 3306,  
    user: 'root', 
    password: 'ROOT', 
    database: 'shop' 
})

module.exports = project;