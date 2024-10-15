const { fetchArticlesById } = require("../models/articles");
const { createComment } = require("../models/comments");
const { fetchCommentsByArticleId } = require("../models/comments");

exports.getCommentsByArticleId = (request, response, next) => {
    const { article_id } = request.params;

    const promises = [fetchCommentsByArticleId(article_id)];

    if (article_id) {
        promises.push(fetchArticlesById(article_id));
    }

    Promise.all(promises)
        .then((results) => {
            const comments = results[0];
            response.status(200).send({ comments: comments });
        })
        .catch((err) => {
            next(err);
        });
};

exports.postComment = (request, response, next) => {
    const { article_id } = request.params;
    const { username, body } = request.body;

    createComment(article_id, username, body)
        .then((comment) => {
            response.status(201).send({ comment });
        })
        .catch((err) => {
            next(err);
        });
};
