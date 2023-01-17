const express = require("express");
const app = express();
const { getTopics, getArticles, getArtById }  = require("./controller")

app.use(express.json());

app.get('/api/topics', getTopics);

app.get('/api/articles', getArticles);

app.get('/api/articles/:article_id', getArtById);

app.use((request, response, next) => {
    response.status(404).send({msg : "Path Not Found"})
})

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
