\c nc_news_test

SELECT * FROM articles;
SELECT * FROM comments;
--SELECT COUNT(comment_id) AS comment_count FROM articles LEFT OUTER JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id;
SELECT comments.comment_id, comments.votes, comments.created_at, comments.author, comments.body, articles.article_id
FROM comments JOIN articles ON articles.article_id = comments.article_id
WHERE articles.article_id = 1;