const { 
    fetchTopics,
    fetchArticles,
    fetchArtById,
    fetchComByArt

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
    fetchArticles().then((articles) => {
        response.status(200).send(articles)
    })
    .catch((err) => {
        next(err)
    });
};

const getArtById = (request, response, next) => {
    const { article_id } = request.params;
    fetchArtById(article_id).then((article) => {
        response.status(200).send(article)
    })
    .catch((err) => {
        next(err)
    });
};

const getComByArt = (request, response, next) => {
    const { article_id } = request.params;
    Promise.all([fetchArtById(article_id), fetchComByArt(article_id)])
    .then((commentArr) => {
        response.status(200).send(commentArr[1])
    })
    .catch((err) => {
        next(err)
    });
};

module.exports = {
    getTopics,
    getArticles,
    getArtById,
    getComByArt
};