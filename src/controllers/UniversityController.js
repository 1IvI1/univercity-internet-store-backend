const databaseQuery = require("../index");

const getUniversities = () => {
  return databaseQuery.runQuery("SELECT id, shortName FROM universities;")
}

const getFaculties = id => {
  return databaseQuery.runQuery(`SELECT id, shortName FROM faculties WHERE universities_id = ${id};`)
}

const getGroups = id => {
  return databaseQuery.runQuery(`SELECT id, shortName FROM groups_fac WHERE faculties_id = ${id};`)
}

module.exports.getUniversities = getUniversities
module.exports.getFaculties = getFaculties
module.exports.getGroups = getGroups