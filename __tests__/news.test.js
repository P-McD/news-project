const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const request = require("supertest");
const app = require("../db/app");
const response = require("../db/app");
const testData = require("../db/data/test-data");

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
                body.forEach((topic) => {
                expect(topic).toHaveProperty('description')
                expect(topic).toHaveProperty('slug')
            });
            });
        });
    })
})
