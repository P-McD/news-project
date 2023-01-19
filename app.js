const express = require("express");
const app = express();
const { 
    getTopics, 
    getArticles, 
    getArticleById, 
    getCommentByArticle, 
    postComment,
    patchArticleVotes }  = require("./controller")

app.use(express.json());

///GET///

app.get('/api/topics', getTopics);

app.get('/api/articles', getArticles);

app.get('/api/articles/:article_id', getArticleById);

app.get('/api/articles/:article_id/comments', getCommentByArticle);

///POST///

app.post('/api/articles/:article_id/comments', postComment);

///PATCH///
app.patch('/api/articles/:article_id', patchArticleVotes);

///MIDDLEWARE///

app.use((request, response, next) => {
    response.status(404).send({msg : "Not Found"})
})

app.use((err, request, response, next) => {
    if(err.code === "22P02" || err.code === "23503") {
      console.log(err, 'PG Error')
      response.status(400).send({msg : "Bad Request"})
    } else {
      next(err);
    };
  });

app.use((err, request, response, next) => {
    if(err.status){
        console.log(err, 'Error encountered')
        response.status(err.status).send({msg : err.msg})
    } else {
        next(err)
    };
});

app.use((err, request, response, next) => {
    console.log(err, "<- Internal error handler")
    response.status(500).send({msg : "Problem in code"})
  })

module.exports = app;
