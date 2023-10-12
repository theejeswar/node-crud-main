const express = require('express');
const mysql = require('mysql');
const customers = require('./routes/customers');
const connection = require('express-myconnection');
const cors = require('cors');
let path = require('path');

const app = express();
app.use(cors());

app.set('port', process.env.PORT || 4300);
app.use(express.json());
app.use(express.urlencoded());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
    connection(mysql, {
        host: 'localhost',
        user: 'root',
        password: 'root',
        port: 3306,
        database: 'forms'
    }, 'request')
);

app.get('/', customers.home);
app.get('/customer/', customers.list);
app.post('/customer/login', customers.login);
app.post('/customer/add', customers.add);
app.put('/customer/:id', customers.update);
app.delete('/customer/d/:id', customers.delete);
app.post('/customer/delete',customers.del)
app.listen(app.get('port'), () => {
    console.log('Express server running at ' + app.get('port'));
});