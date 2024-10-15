const db = require("../db/connection");

exports.fetchCommentsByArticleId = (article_id) => {
    return db
        .query(
            `
            SELECT comments.comment_id, comments.votes, comments.created_at, comments.author, comments.body, articles.article_id
            FROM comments JOIN articles ON articles.article_id = comments.article_id
            WHERE articles.article_id = $1
            ORDER BY comments.created_at DESC;
        `,
            [article_id]
        )
        .then(({ rows }) => {
            return rows;
        });
};

exports.createComment = (article_id, username, body) => {
    if (!body || !username) {
        return Promise.reject({ status: 400, msg: "Bad Request" });
    }

    return db
        .query(
            `
        SELECT * FROM users
        WHERE username = $1`,
            [username]
        )
        .then(({ rows }) => {
            if (rows.length === 0) {
                return db
                    .query(
                        `
                    INSERT INTO users (username, name, avatar_url)
                    VALUES ($1, 'Joe', 'https://www.photoOfJoe.com')
                    RETURNING *
                `,
                        [username]
                    )
                    .then(({ rows }) => {
                        return rows[0];
                    });
            } else {
                return rows[0];
            }
        })
        .then(() => {
            return db.query(
                `
            INSERT INTO comments (body, article_id, author, votes, created_at)
            VALUES ($1, $2, $3, 0, NOW())
            RETURNING *;
            `,
                [body, article_id, username]
            );
        })
        .then(({ rows }) => {
            return rows[0];
        });
};
