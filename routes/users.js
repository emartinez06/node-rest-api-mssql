let sql = require('mssql');
let express = require('express');
let app = express.Router()

//Initiallising connection string
var dbConfig = {
    user: 'demo',
    password: 'demo2019',
    server: 'localhost',
    database: 'demo_api',
    port: 1433
};

//GET API
app.get('/', (req, res) => {
    sql.connect(dbConfig, () => {
        var request = new sql.Request();
        request.query('SELECT * FROM dbo.users', (err, recordsets) => {
            if (err) { throw err };
            res.setHeader('Content-Type', 'application/json');
            sql.close();
            return res.send({ users: recordsets.recordset }); // Result in JSON format
        });
    });
});

app.get('/:id', (req, res) => {
    sql.connect(dbConfig, () => {
        var request = new sql.Request();
        var stringRequest = 'SELECT * FROM dbo.users WHERE id = ' + req.params.id;
        request.query(stringRequest, (err, recordset) => {
            if (err) { throw err };
            res.setHeader('Content-Type', 'application/json');
            sql.close();
            return res.send({ user: recordset.recordset[0] }); // Result in JSON format
        });
    });
});

//POST API
app.post("/", (req, res) => {
    sql.connect(dbConfig, () => {
        var transaction = new sql.Transaction();
        transaction.begin(() => {
            var request = new sql.Request(transaction);
            let username = req.body.username;
            let lastName = req.body.last_name;
            let firstName = req.body.first_name;
            let age = req.body.age;
            let direction = req.body.direction;
            request.input("username", sql.VarChar(30), username)
            request.input("last_name", sql.VarChar(30), lastName)
            request.input("first_name", sql.VarChar(30), firstName)
            request.input("age", sql.Int(), age)
            request.input("direction", sql.Text(), direction)
            request.execute("insertUserData", () => {
                transaction.commit()
                    .then(() => {
                        sql.close();
                        res.setHeader('Content-Type', 'application/json');
                        return res.status(200).send({ result: 'Data added successfully', data: req.body })
                    })
                    .catch((err) => {
                        sql.close();
                        res.setHeader('Content-Type', 'application/json');
                        return res.status(400).send({ result: "Error while inserting data", error: err });
                    });
            })
        });
    });
});

//PUT API
app.put("/:id", function (req, res) {
    sql.connect(dbConfig, () => {
        var transaction = new sql.Transaction();
        transaction.begin(() => {
            var request = new sql.Request(transaction);
            let id = req.params.id;
            let username = req.body.username;
            let lastName = req.body.last_name;
            let firstName = req.body.first_name;
            let age = req.body.age;
            let direction = req.body.direction;
            request.input("username", sql.VarChar(30), username)
            request.input("last_name", sql.VarChar(30), lastName)
            request.input("first_name", sql.VarChar(30), firstName)
            request.input("age", sql.Int(), age)
            request.input("direction", sql.Text(), direction)
            request.input("id", sql.Int(), id)
            request.execute("updateUserData", () => {
                transaction.commit()
                    .then(() => {
                        sql.close();
                        res.setHeader('Content-Type', 'application/json');
                        return res.status(200).send({ result: 'Data updated successfully', data: req.body })
                    })
                    .catch((err) => {
                        sql.close();
                        res.setHeader('Content-Type', 'application/json');
                        return res.status(400).send({ result: "Error while updating data", error: err });
                    });
            })
        });
    });
});

// DELETE API
app.delete("/:id", (req, res) => {
    var query = "DELETE FROM dbo.users WHERE id =" + req.params.id;
    sql.connect(dbConfig, () => {
        var request = new sql.Request();
        request.query(query, (err) => {
            if (err) { throw err };
            res.setHeader('Content-Type', 'application/json');
            sql.close();
            return res.send({ result: 'Record deleted successfully' }); // Result in JSON format
        });
    });
});

module.exports = app;