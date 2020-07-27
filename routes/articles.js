const express = require('express');
const Article = require('../models/articles');

const article = new Article();
const router = express.Router();

router.get('/', async(req, res) => {
    const all_articles = await article.getAll();
    res.render('article_index', { all_articles: all_articles });
});

router.get('/new', (req, res) => {
    if (req.session.currentUser)
        res.render('article_new', {});
    else
        res.redirect('/');
});

router.post('/create', async(req, res) => {
    if (!req.session.currentUser)
        res.redirect('/');
    else {
        const new_article_id = await article.create(req.body.title, req.body.body, req.session.currentUser.user_id);
        res.redirect('/articles/' + new_article_id + '/show');
    }
});

router.get('/:id/show', async(req, res) => {
    const current_article = await article.find(req.params.id);
    if (!current_article)
        res.redirect('/');
    else
        res.render('article_show', { current_article: current_article[0] });
});

router.get('/:id/delete', async(req, res) => {
    const current_article = await article.find(req.params.id);
    if (!current_article || current_article[0].user_id != req.session.currentUser.user_id)
        res.redirect('/');
    else {
        const delete_article = await article.delete(current_article[0].id);
        res.redirect('/articles');
    }
});

module.exports = router;