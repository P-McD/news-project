
const db = require("./db/connection");
const { commentData } = require("./db/data/test-data");
const articles = require("./db/data/test-data/articles");

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

const fetchComByArt = (article_id) => {
    const comByArtStr = `
    SELECT * FROM comments
    WHERE article_id = $1;
    `;
    return db.query(comByArtStr, [article_id])
    .then(({ rows }) => {
        return rows 
    });
};

const createComment = (article_id, sentComment) => {
    
    if(!sentComment || !sentComment.body || !sentComment.username) {
        return Promise.reject({status : 400, msg: "Bad Request"})
    };

    const commentData = [sentComment.username, sentComment.body, article_id];
    const usernameData = sentComment.username;
    const doesUserExistStr = `
    SELECT * FROM users
    WHERE username = $1;
    `;
    return db.query(doesUserExistStr, [usernameData])
    .then(({rows}) => {
        if (rows.length === 0) {
            return Promise.reject({status : 404, msg : "Not Found"})
        };
    })
    .then(() => { 
        const createComStr = `
        INSERT INTO comments(author, body, article_id)
        VALUES 
        ($1, $2, $3)
        RETURNING *;`

        return db.query(createComStr, commentData)
        .then(({rows}) => {
        return rows;
        });
    });
};

 

module.exports = { fetchTopics, fetchArticles, fetchArtById, fetchComByArt, createComment};
