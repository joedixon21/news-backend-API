const db = require("../db/connection");

exports.fetchArticlesById = (article_id) => {
	if (isNaN(article_id)) {
		return Promise.reject({ status: 400, msg: "Bad Request" });
	}
	return db
		.query(
			`
            SELECT * FROM articles
            WHERE article_id = $1;
        `,
			[article_id]
		)
		.then(({ rows }) => {
			if (!rows.length) {
				return Promise.reject({ status: 404, msg: "Not Found" });
			}
			return rows[0];
		});
};
