const connection = require('express-myconnection');
const path = require('path');

exports.home = (req, res) => {
    const pathFile = path.join(__dirname, '../public', 'home.html');
    res.sendFile(pathFile);
}

exports.list = (req, res) => {
    req.getConnection(function (err, connection) {
        var query = connection.query('SELECT * FROM customer', function (err, rows) {
            if (err) {
                console.log('Error selecting : %s', err);
                res.status(500).json({ error: 'Internal server error' });
                return;
            }
            res.json(rows);
        });
    });
}

exports.add = (req, res) => {
    var input = JSON.parse(JSON.stringify(req.body));
    req.getConnection(function (err, connection) {
        var inputData = {
            name: input.name,
            email: input.email,
            phone: input.phone
        };
        var query = connection.query('INSERT INTO customer SET ?', inputData, function (err, data) {
            if (err) {
                console.log('Error Inserting : %s', err);
            }
            inputData["id"] = data.insertId;
            res.send(inputData);
        });
    });
}

exports.update = (req, res) => {
    var input = JSON.parse(JSON.stringify(req.body));
    var id = req.params.id;
    req.getConnection(function (err, connection) {
        var inputData = {
            name: input.name,
            email: input.email,
            phone: input.phone
        };
        var query = connection.query('UPDATE customer SET ? WHERE id=?', [inputData, id], function (err, data) {
            if (err) {
                console.log('Error Updating :%s', err);
            }
            inputData["id"] = data.insertId;
            res.send(inputData);
        });
    });
}

exports.delete = (req, res) => {
    var input = JSON.parse(JSON.stringify(req.body));
    var id = req.params.id;
    req.getConnection(function (err, connection) {
        var query = connection.query('DELETE FROM customer WHERE id = ?', id, function (err, rows) {
            if (err) {
                console.log('Error deleting : %s', err);
            }
            res.json(rows);
        });
    });
}

exports.login = (req, res) => {
    var input = JSON.parse(JSON.stringify(req.body));
    req.getConnection(function (err, connection) {
        var inputData = {
            name: input.username,
            password: input.password,
        };
        var query = connection.query(
            'SELECT * FROM users WHERE username = ?',
            [input.username],
            function (err, data) {
                if (err) {
                    console.log('Error querying the database: %s', err);
                    return res.status(500).json({ message: 'Internal server error.' });
                }

                if (data.length === 0) {
                    return res.status(404).json({ message: 'User not found.' });
                }

                var user = data[0];

                // Check if the password matches the stored password
                if (user.password !== input.password) {
                    return res.status(401).json({ message: 'Invalid credentials.' });
                }

                // Return the user data (you can also choose to send a JWT token here)
                res.status(200).json({ message: 'Login successful.', user });
            }
        );
    });
};






exports.del = (req, res) => {
    const { id } = req.body;
    req.getConnection(function (err, connection) {
        var query = connection.query('DELETE FROM customer WHERE id=?', id, function (err, rows) {
            if (err) {
                console.log('Error deleting: %s', err)
            }
            res.json(rows)
        })
    })
}