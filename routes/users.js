const express = require('express');
const User = require('../models/users');
const router = express.Router();

const user = new User();

router.get('/', (req, res) => {
    res.send('We are on users');
});

router.post('/authenticate', async(req, res) => {
    var login_user = await user.login(req.body.username, req.body.password);
    if (login_user) {
        req.session.currentUser = {
            username: login_user.username,
            user_id: login_user.id
        };
        req.session.oop = 0;

        // console.log("This is new user " + new_user[0].username);
        res.redirect("/users/" + login_user.id + "/infor");
    } else {
        console.log('Your password or password is not correct');
        res.redirect('/');
    }
});

router.post('/register', async(req, res) => {
    let userInput = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    };
    console.log(req.body);
    const result = await user.create(userInput);
    // console.log("This is result from api " + result);
    if (result) {
        const new_user = await user.find(result);
        req.session.currentUser = {
            username: new_user[0].username,
            user_id: new_user[0].id
        };
        req.session.oop = 0;

        // console.log("This is new user " + new_user[0].username);
        res.redirect("/users/" + new_user[0].id + "/infor");
    } else {
        console.log('Error creating a new user account');
        res.redirect('/');
    }

});

router.get('/:id/infor', async(req, res) => {
    var currentUser = await user.find(parseInt(req.params.id));
    console.log(currentUser);
    if (req.session.currentUser) {
        if (currentUser[0].id != req.session.currentUser.user_id)
            res.redirect('/');
        else
            res.render('user_info', { user_info: currentUser[0] });
    } else
        res.redirect('/');

});

router.get('/:id/edit', async(req, res) => {
    var currentUser = await user.find(parseInt(req.params.id));
    console.log(currentUser);
    if (req.session.currentUser) {
        if (currentUser[0].id != req.session.currentUser.user_id)
            res.redirect('/');
        else
            res.render('user_edit', { user_info: currentUser[0] });
    } else
        res.redirect('/');
});

router.post('/:id/update', async(req, res) => {
    if (req.session.currentUser) {
        if (req.session.currentUser.user_id != req.params.id)
            redirect('/');
        else {
            const update = await user.update(req.params.id, req.body.username, req.body.password, req.body.email);
            res.redirect('/users/' + req.params.id + '/infor');
        }
    } else
        res.redirect('/');
});


router.get('/signout', (req, res) => {
    if (req.session.currentUser) {
        req.session.destroy(function() {
            res.redirect('/');
        });
    } else
        res.redirect('/');
});

module.exports = router;