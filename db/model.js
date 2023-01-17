
const db = require("../db/connection")

const fetchTopics = () => {
    let fetchTopicsStr = `
    SELECT * FROM topics;
    `;
    return db.query(fetchTopicsStr)
    .then(({rows}) => {
        if (rows.length > 0) {
            return rows;
        } else {
            return Promise.reject({status : 404, msg : "Not Found"});
        };
    });
};

const fetchArticles = () => {
    let fetchArticlesStr = `
    SELECT articles.*, COUNT(comments.article_id) 
    AS comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
    GROUP BY articles.article_id
    ORDER BY created_at DESC
    `;
    return db.query(fetchArticlesStr)
    .then(({rows}) => {
        if (rows.length > 0) {
            return rows;
        } else {
            return Promise.reject({status : 404, msg : "Not Found"});
        };
    });
};

const fetchArtById = (article_id) => {
const fetchArtIdStr = `
SELECT * from articles
WHERE article_id = $1;
`;
return db.query(fetchArtIdStr, [article_id])
.then(({rows}) => {
    if (rows.length > 0) {
        return rows[0];
    } else {
        return Promise.reject({status : 404, msg : "Not Found"})
    };
});
};


module.exports = { fetchTopics, fetchArticles, fetchArtById };