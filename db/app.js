const express = require("express");
const app = express();
const { getTopics, getArticles }  = require("./controller")

app.use(express.json());

app.get('/api/topics', getTopics);
app.get('/api/articles', getArticles);
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
