const pool = require('./pool');
const bcrypt = require('bcrypt');

function User() {};

User.prototype = {
    find: function(user = null) {
        if (user) {
            var field = Number.isInteger(user) ? 'id' : 'username';
        };

        var sql = `select * from users where ${field} = ?`;

        pool.query(sql, user, function(err, result) {
            if (err) throw err;
            return result;
        });
    },
    create: function(body) {
        let pwd = body.password;
        body.password = bcrypt.hashSync(pwd, 10);

        var bind = [body.username, body.email, body.password];

        let sql = `insert into users(username,email,password) values (?,?,?)`;
        pool.query(sql, bind, function(err, result) {
            if (err) throw err;
            // console.log(result);
            // console.log(result.affectedRows);
            if (result.affectedRows != 1) {
                console.log('Error in create an acount');
                return null;
            } else {
                console.log("This is return value" + body.username);
                return body.username;
            }
        });
    },
    login: function(username, password) {
        const user = this.find(username);
        if (result[0]) {
            if (bcrypt.compareSync(password, result[0].password)) {
                return result[0];
            }
        }
        return null;
    },
    update: function(username, password, email) {
        const user = this.find(username);
        if (result[0]) {
            let pwd = password;
            password = bcrypt.hashSync(pwd, 10);
            let sql = `UPDATE users SET password = ${password}, address = ${email} WHERE username = ${username}`;
            pool.query(sql, function(err, result) {
                if (err) throw err;
                console.log(result.affectedRows + " record(s) updated");
            });
        }
    }
}

module.exports = User;