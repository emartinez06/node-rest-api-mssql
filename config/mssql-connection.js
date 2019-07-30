let sql = require('mssql');

const sqlconnection = new sql.ConnectionPool({
    user: 'demo',
    password: 'demo2019',
    server: 'localhost',
    database: 'demo_api'
})

sqlconnection.connect(err => {
    if(err){throw err};
    console.log('Connection successfull');
});

module.exports = sqlconnection;