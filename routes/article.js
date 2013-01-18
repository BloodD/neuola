/*
 * The Article module
 */

var common = require('./common');
var Post = require('../my/model/post')
  , Catalog = require('../my/model/catalog');

exports.catalog = function catalog(req, res) {
  var catalog = req.params.catalog;
  Post.list({
    catalog: catalog
  }, function(err, posts) {
    Catalog.get(catalog, function(err, catalog) {
      if (catalog) {
        res.render('catalog', {
          title: catalog.name,
          description: catalog.description,
          posts: posts
        });
      } else {
        common.error(res, '没这个栏目吧？', '/');
      }
    });
  });
};

exports.article = function article(req, res) {
  var catalog = req.params.catalog;
  var article = req.params.article;
  Post.getByUrl(catalog, article, function(err, post) {
    if (post) {
      res.render('article', {
        title: post.title,
        post: post
      });
    } else {
      common.error(res, '没有这篇文章吧？', '/');
    }
  });
};

exports.tag = function tag(req, res) {
  var tags = req.param('tag')?req.param('tag').split(/\s*,\s*/):[];
  Post.find({tag:{$all:tags}}, function(err, posts) {
    if (err) {
      common.error(res, err, '/');
    } else {
      res.render('catalog', {
        title: tags.toString(),
        description: '所有关于“' + tags.toString() + '”的文章',
        posts: posts
      });
    }
  });
};
