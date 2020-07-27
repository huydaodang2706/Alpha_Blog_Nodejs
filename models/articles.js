const pool = require('./pool');

function Article() {};

Article.prototype = {
    find: function(id = null) {
        var sql = `select * from articles where id = ?`;
        return new Promise((resolve, reject) => {
            if (id) {
                pool.query(sql, id, function(err, result) {
                    if (err) return reject(err);
                    return resolve(result);
                });
            } else
                return resolve(null);
        });
    },
    findByUser: function(user = null) {
        return new Promise((resolve, reject) => {
            if (user) {
                if (Number.isInteger(user)) {
                    var sql = `select * from articles where user_id = ?`;
                } else {
                    var sql = `select * from articles inner join users on articles.user_id = users.id where username = ?`;
                }
                pool.query(sql, user, function(err, result) {
                    if (err) return reject(err);
                    return resolve(result);
                });
            } else
                return resolve(null);
        })
    },
    getUser: function(id = null) {
        var sql = `select users.id from users inner join articles on users.id = articles.user_id where articles.id = ?`;
        return new Promise((resolve, reject) => {
            pool.query(sql, id, function(err, result) {
                if (err) return reject(err);
                return resolve(result[0].id);
            });
        });
    },
    create: function(title, body, user_id) {
        let sql = `insert into articles(title,body,user_id) values (?,?,?)`;
        var bind = [title, body, user_id];
        return new Promise((resolve, reject) => {
            if (title == null || body == null || user_id == null)
                return reject(new Error('title,body,user_id is null'));
            pool.query(sql, bind, function(err, result) {
                if (err) return reject(err);
                if (result.affectedRows != 1) {
                    console.log('Error in create an article');
                    return resolve(null);
                } else {
                    console.log("This is return value " + result.insertId);
                    return resolve(result.insertId);
                }
            });
        })

    },
    getAll: function() {
        var sql = `select * from articles`;
        return new Promise((resolve, reject) => {
            pool.query(sql, function(err, result) {
                if (err) return reject(err);
                return resolve(result);
            });
        });
    },
    delete: function(id = null) {
        var sql = `delete from articles where id = ?`;
        return new Promise((resolve, reject) => {
            pool.query(sql, id, function(err, result) {
                if (err) return reject(err);
                return resolve(result);
            });
        })
    }
}

module.exports = Article;