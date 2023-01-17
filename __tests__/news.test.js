const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const request = require("supertest");
const app = require("../db/app");
const response = require("../db/app");
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
    describe('GET articles', () => {
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
                 console.log(comObjKeys, '<obj keys')
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
})