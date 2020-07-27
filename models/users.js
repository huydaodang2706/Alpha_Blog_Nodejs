const pool = require('./pool');
const bcrypt = require('bcrypt');

function User() {};

User.prototype = {
    find: function(user = null) {
        if (user) {
            var field = Number.isInteger(user) ? 'id' : 'username';
        };

        var sql = `select * from users where ${field} = ?`;

        return new Promise((resolve, reject) => {
            pool.query(sql, user, function(err, result) {
                if (err) return reject(err);
                resolve(result);
            });
        })

    },
    create: function(body) {
        let pwd = body.password;
        body.password = bcrypt.hashSync(pwd, 10);

        var bind = [body.username, body.email, body.password];

        let sql = `insert into users(username,email,password) values (?,?,?)`;
        return new Promise((resolve, reject) => {
            pool.query(sql, bind, function(err, result) {
                if (err) return reject(err);
                // console.log(result);
                // console.log(result.affectedRows);
                if (result.affectedRows != 1) {
                    console.log('Error in create an acount');
                    return resolve(null);
                } else {
                    console.log("This is return value" + body.username);
                    return resolve(body.username);
                }
            });
        });

    },
    login: function(username, password) {
        return new Promise(async(resolve, reject) => {
            const result = await this.find(username);
            console.log(result);
            if (result[0]) {
                if (bcrypt.compareSync(password, result[0].password)) {
                    return resolve(result[0]);
                }
            }
            return resolve(null);
        });
    },
    update: function(id, username, password, email) {
        let pwd = password;
        password = bcrypt.hashSync(pwd, 10);
        var bind = [username, password, email, id];
        let sql = `UPDATE users SET username = ?, password = ?, email = ? WHERE id = ?`;
        console.log(sql);
        return new Promise((resolve, reject) => {
            pool.query(sql, bind, function(err, result) {
                if (err) return reject(err);
                console.log(result.affectedRows + " record(s) updated");
                return resolve(result);
            });
        });
    }
}

module.exports = User;