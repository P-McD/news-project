const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const request = require("supertest");
const app = require("../app");
const response = require("../app");
const testData = require("../db/data/test-data")
const sorted = require("jest-sorted");

beforeEach(() => {
    return seed(testData)
})

afterAll(() => {
    if (db.end) db.end()
});

describe('/api/topics', () => {
    describe('GET topics', () => {
        test('Returns Status 200 if the request is successful', () => {
            return request(app).get('/api/topics').expect(200)
        });
        test('Returns an array with description and slug properties', () => {
            return request(app).get('/api/topics')
            .expect(200)
            .then(({body}) => {
                expect(body.length).not.toBe(0);
                body.forEach((topic) => {
                expect(topic).toHaveProperty('description')
                expect(topic).toHaveProperty('slug')
            });
            });
        });
    });
});

describe('/api/articles', () => {
    describe('GET articles withour queries (default)', () => {
        test('Returns status 200 if the request is successful', () => {
            return request(app).get('/api/articles')
            .expect(200);
        });
        test('Returns an array of article objects sorted in descending order by date', () => {
            return request(app).get('/api/articles')
            .expect(200)
            .then(({body}) => {
                expect(body).toBeSortedBy('created_at', {descending : true})
            })
        });
        test('Returns an array of article objects including a comment count', () => {
            return request(app).get('/api/articles')
            .expect(200)
            .then(({body}) => {
                expect(body.length).not.toBe(0)
                body.forEach((article) => {
                    expect(article).toHaveProperty('author');
                    expect(article).toHaveProperty('title');
                    expect(article).toHaveProperty('article_id');
                    expect(article).toHaveProperty('topic');
                    expect(article).toHaveProperty('created_at');
                    expect(article).toHaveProperty('votes');
                    expect(article).toHaveProperty('article_img_url');
                    expect(article).toHaveProperty('comment_count');
                });
            });
        });
        test('Presents the correct number of comments', () => {
            return request(app).get('/api/articles')
            .expect(200)
            .then(({body}) => {
                const compareComment = [...testData.commentData];
                const idArray = [];
                const countCommentsObj = {};
                compareComment.forEach((comment) => {
                    idArray.push(comment.article_id)
                });
                idArray.forEach((value) => {
                    countCommentsObj[value] = (countCommentsObj[value]||0 ) + 1
                });
                 const comObjKeys = Object.keys(countCommentsObj);
                    const numComKeys = comObjKeys.map((key) => {
                        return parseInt(key)
                    })

                body.forEach((article) => {
                    let artNum = (article.comment_count * 1)
                    if (artNum !==0){   
                        expect(artNum).toEqual(countCommentsObj[article.article_id]);
                    } else {
                        expect(numComKeys).not.toContain(artNum)
                    };
                });
            });
        });
    });
    describe('GET using queries', () => {
        test('returns all results which have a specified topic', () => {
            return request(app).get('/api/articles?topic=mitch')
            .expect(200)
            .then(({body}) => {
                expect(body.length).toBe(11)
                body.forEach((article) => {
                    expect(article.topic).toBe('mitch')
                });
            });
        });
        test('returns a 200 and empty array if a topic is entered which exists in the database but has no articles attributed to it', () => {
            return request(app).get('/api/articles?sort_by=title&topic=paper')
            .expect(200)
            .then(({body}) => {
               expect(body.length).toBe(0)
            });
        });
        test('returns all articles which are sorted by title, descending by default when no other queries have been entered', () => {
            return request(app).get('/api/articles?sort_by=title')
            .expect(200)
            .then(({body}) => {
                expect(body.length).not.toBe(0);
                expect(body).toBeSortedBy('title', {descending : true})
            });
        });
        test('returns all articles which are sorted by author, ascending', () => {
            return request(app).get('/api/articles?sort_by=author&order=ASC')
            .expect(200)
            .then(({body}) => {
                expect(body.length).not.toBe(0);
                expect(body).toBeSortedBy('author', {descending : false})
            });
        });
        test('returns all articles which are sorted by author, ascending with a topic of cats', () => {
            return request(app).get('/api/articles?sort_by=author&order=ASC&topic=cats')
            .expect(200)
            .then(({body}) => {
                expect(body.length).toBe(1);
                body.forEach((article) => {
                    expect(article.topic).toBe('cats')
                })
                expect(body).toBeSortedBy('author', {descending : false})
            });
        });
        test('returns a 400 bad request error if attempting to sort by an invalid value', () => {
            return request(app).get('/api/articles?sort_by=secretvalue&order=ASC&topic=cats')
            .expect(400)
            .then(({body}) => {
               expect(body.msg).toBe("Bad Request")
            });
        });
        test('returns a 400 bad request error if attempting to order by an invalid value', () => {
            return request(app).get('/api/articles?sort_by=title&order=whoops&topic=cats')
            .expect(400)
            .then(({body}) => {
               expect(body.msg).toBe("Bad Request")
            });
        });
        test('returns a 404 not found if a topic is entered which does not exist in the database', () => {
            return request(app).get('/api/articles?sort_by=title&topic=anythingButMitch')
            .expect(404)
            .then(({body}) => {
               expect(body.msg).toBe("Not Found")
            });
        });
    });
});

describe('/api/articles/:article_id', () => {
    describe('GET articles by article ID', () => {
        test('returns the specified article', () => {
            return request(app).get('/api/articles/2')
            .expect(200)
            .then(({body}) => {
                expect(body.article_id).toBe(2)
            });
        });
        test('returns an object with all of the specified properties', () => {
            return request(app).get('/api/articles/3')
            .expect(200)
            .then(({body}) => {
                expect(body).toHaveProperty('author');
                expect(body).toHaveProperty('title');
                expect(body).toHaveProperty('article_id');
                expect(body).toHaveProperty('body');
                expect(body).toHaveProperty('topic');
                expect(body).toHaveProperty('created_at');
                expect(body).toHaveProperty('votes');
                expect(body).toHaveProperty('article_img_url');
            });
        });
        test('returns a 404 for an article with an ID which does not exist', () => {
            return request(app).get('/api/articles/9001')
            .expect(404)
            .then(({body}) => {
                expect(body.msg).toBe("Not Found")
            });
        });
    });
    describe('PATCH votes on an article', () => {
        test('returns the correct article with incremented votes when given the correct id', () =>{ 
            return request(app).patch('/api/articles/5')
            .expect(200)
            .send(
                { inc_votes : 30 }
                )
            .then(({body}) => {
                expect(body).toMatchObject({
                    article_id : 5,
                    title : expect.any(String),
                    topic : expect.any(String),
                    votes: 30,
                    created_at : expect.any(String),
                    author : expect.any(String),
                    body : expect.any(String),
                    article_img_url: expect.any(String)
                });
            });
        });
        test('returns the article with a negative value of votes if the value of inc_votes ia a negative number', () =>{ 
            return request(app).patch('/api/articles/5')
            .expect(200)
            .send(
                { inc_votes : -22 }
                )
            .then(({body}) => {
                expect(body.article_id).toBe(5);
                expect(body.votes).toBe(-22);
            });
        });
        test('returns a 400 error if inc_votes is not a number', () =>{ 
            return request(app).patch('/api/articles/5')
            .expect(400)
            .send(
                { inc_votes : 'cats' }
                )
            .then(({body}) => {
                expect(body.msg).toBe("Bad Request")
            });
        });
        test('returns a 400 error if article_id is not a number', () =>{ 
            return request(app).patch('/api/articles/cats')
            .expect(400)
            .send(
                { inc_votes : 2 }
                )
            .then(({body}) => {
                expect(body.msg).toBe("Bad Request")
            });
        });
        test('returns a 400 error if nothing is sent', () =>{ 
            return request(app).patch('/api/articles/cats')
            .expect(400)
            .then(({body}) => {
                expect(body.msg).toBe("Bad Request")
            });
        });
        test('returns a 400 error if an empty object is sent', () =>{ 
            return request(app).patch('/api/articles/cats')
            .expect(400)
            .send({})
            .then(({body}) => {
                expect(body.msg).toBe("Bad Request")
            });
        });
        test('returns a 404 error if the article id is a number but does not exist', () =>{ 
            return request(app).patch('/api/articles/9001')
            .expect(404)
            .send(
                { inc_votes : 2} )
            .then(({body}) => {
                expect(body.msg).toBe("Not Found")
            });
        });
    });
});

describe('/api/invalid_path', () => {
    test('Returns a 404 error if an invalid path is entered', () => {
        return request(app).get('/api/invalid-path')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe("Not Found")
        });
    });
});

describe('/api/articles/:article_id/comments', () => {
    describe('GET comments by article id', () => {
        test('returns a status of 200 and an array of comments for the given article id if there are comments present', () => {
            return request(app).get('/api/articles/1/comments')
            .expect(200)
            .then(({ body }) => {
                body.forEach((comment) => {
                    expect(comment).toEqual(expect.objectContaining({
                        article_id: 1
                    }));
                });
            });
        });
        test('returns comment objects with the appropriate properties', () => {
            return request(app).get('/api/articles/1/comments')
            .expect(200)
            .then(({ body }) => {
                body.forEach((comment) => {
                    expect(comment).toMatchObject({
                        article_id : 1,
                        comment_id : expect.any(Number),
                        votes: expect.any(Number),
                        created_at : expect.any(String),
                        author : expect.any(String),
                        body : expect.any(String)
                    });
                });
            });
        });
        test('returns a status of 200 and an empty array if given an article id which exists but has no comments', () => {
            return request(app).get('/api/articles/2/comments')
            .expect(200)
            .then(({body}) => {
                expect(body.length).toBe(0)
            });
        });
        test(`uses an extra verification step to return a status of 404 if article id doesn't exist`, () => {
            return request(app).get('/api/articles/9001/comments')
            .expect(404)
            .then(({body}) => {
                expect(body.msg).toBe("Not Found")
            });
        });
        test(`uses an extra verification step to return a status of 400 if article id is not a number`, () => {
            return request(app).get('/api/articles/cats/comments')
            .expect(400)
            .then(({body}) => {
                expect(body.msg).toBe("Bad Request")
            });
        });
    });
    describe('POST comments by article id', () => {
        test('returns a newly posted comment when passed a valid new comment and a valid article id', () => {
            return request(app).post('/api/articles/3/comments')
            .expect(201)
            .send({ 
                username : 'rogersop',
                body: 'ello'
            })
            .then(({body}) => {
                expect(body[0]).toMatchObject({
                    comment_id : expect.any(Number),
                    body: 'ello',
                    article_id : 3,
                    author : 'rogersop',
                    votes: expect.any(Number),
                    created_at : expect.any(String)
                })
            })
        })
        test('returns a 400 error if an attempt is made to post without either a username or body key', () => {
            return request(app).post('/api/articles/2/comments')
            .expect(400)
            .send({
                body : "I'll try sending this message anonymously"
            })
            .then(({body}) => {
                expect(body.msg).toBe("Bad Request");
            });
        });
        test('returns a 400 error if an attempt is made to post without any comment', () => {
            return request(app).post('/api/articles/2/comments')
            .expect(400)
            .then(({body}) => {
                expect(body.msg).toBe("Bad Request");
            });
        });
        test('returns a 400 error if an attempt is made to post to an article id which is not a number', () => {
            return request(app).post('/api/articles/cats/comments')
            .expect(400)
            .send({ 
                username : 'rogersop',
                body: 'Can I post this way?'
            })
            .then(({body}) => {
                expect(body.msg).toBe("Bad Request");
            });
        });
        test('returns a 404 error if the username is not found', () => {
            return request(app).post('/api/articles/2/comments')
            .expect(404)
            .send({
                username : 'newguy',
                body : "I'll try and post a comment"
            })
            .then(({body}) => {
                expect(body.msg).toBe("Not Found");
            });
        });
        test('returns a 404 error if the article is not found', () => {
            return request(app).post('/api/articles/9001/comments')
            .expect(404)
            .send({
                username : 'rogersop',
                body : "I wonder if this article exists?"
            })
            .then(({body}) => {
                expect(body.msg).toBe("Not Found");
            });
    })
})
});

describe('/api/users', () => {
    describe('GET users', () => {
        test('returns an array which is greater than length 0', () => {
            return request(app).get('/api/users')
            .expect(200)
            .then(({body}) => {
                expect(body.length).not.toBe(0);
            });
        });
        test('returns all users as an array of objects with the appropriate properties', () => {
            return request(app).get('/api/users')
            .expect(200)
            .then(({body}) => {
                body.forEach((user) => {
                    expect(user).toMatchObject(
                        { 
                        username : expect.any(String),
                        name : expect.any(String),
                        avatar_url : expect.any(String)
                        }
                    );
                });
            });
        });
    });
});