const db = require("../db/connection");

exports.fetchCommentsByArticleId = (article_id) => {
    // if (isNaN(article_id)) {
    //     return Promise.reject({ status: 400, msg: "Bad Request" });
    // }
    return db
        .query(
            `
            SELECT comments.comment_id, comments.votes, comments.created_at, comments.author, comments.body, articles.article_id
            FROM comments JOIN articles ON articles.article_id = comments.article_id
            WHERE articles.article_id = $1;
        `,
            [article_id]
        )
        .then(({ rows }) => {
            // if (!rows.length) {
            //     return Promise.reject({ status: 404, msg: "Not Found" });
            // }
            return rows;
        });
};
