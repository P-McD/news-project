
const db = require("../db/connection")

const fetchTopics = () => {
    let fetchTopicsStr = `
    SELECT * FROM topics;
    `;
    return db.query(fetchTopicsStr)
    .then (({rows}) => {
        console.log(rows);
        return rows;
    });
}

module.exports = { fetchTopics };