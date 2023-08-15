const { 
    fetchTopics,
    fetchArticles,
    fetchArticleById,
    fetchCommentByArticle,
    createComment,
    fetchUsers,
    updateArticleVotes
} = require('./model');

const getTopics = (request, response, next) => {
    fetchTopics().then((topics) => {
        response.status(200).send(topics)
    })
    .catch((err) => {
        next(err)
    });
};

const getArticles = (request, response, next) => {
    const {topic, sort_by, order} = request.query;
    fetchArticles(topic, sort_by, order).then((articles) => {
        response.status(200).send(articles)
    })
    .catch((err) => {
        next(err)
    });
};

const getArticleById = (request, response, next) => {
    const { article_id } = request.params;
    fetchArticleById(article_id).then((article) => {
        response.status(200).send(article)
    })
    .catch((err) => {
        next(err)
    });
};

const getCommentByArticle = (request, response, next) => {
    const { article_id } = request.params;
    fetchCommentByArticle(article_id)
    .then((returnedComment) => {
        response.status(200).send(returnedComment)
    })
    .catch(next);
};

const postComment = (request, response, next) => {
    const {article_id} = request.params;
    const sentComment  = request.body;
    createComment(article_id, sentComment)
    .then((returnedObj) => {
        response.status(201).send(returnedObj)
    })
    .catch((next));
};

const getUsers = (request, response, next) => {
    fetchUsers().then((users) => {
        return response.status(200).send(users)
    })
    .catch((err) => {
        next(err);
    });
};

const patchArticleVotes = (request, response, next) => {
    const { article_id } = request.params;
    const votesBody = request.body;
    updateArticleVotes(article_id, votesBody)
    .then((returnedVotes) => {
        return response.status(200).send(returnedVotes)
    })
    .catch((err) => {
        next(err)
    });
};

module.exports = {
    getTopics,
    getArticles,
    getArticleById,
    getCommentByArticle,
    postComment, 
    getUsers,
    patchArticleVotes
};
