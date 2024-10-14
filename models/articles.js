const db = require("../db/connection");

exports.fetchArticlesById = (article_id) => {
	return db
		.query(
			`
            SELECT * FROM articles
            WHERE article_id = $1;
        `,
			[article_id]
		)
		.then(({ rows }) => {
			return rows[0];
		});
};
