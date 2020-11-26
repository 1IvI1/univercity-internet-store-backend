const { get } = require("mongoose");
const databaseQuery = require("../index");

const getLastDBModification = table => {
    return new Promise((accept) => {
        // databaseQuery.runQuery(`SELECT * FROM ${table} WHERE id = SCOPE_IDENTITY()`, response => {
        //     accept(response)
        // })
    })
}


module.exports = getLastDBModification