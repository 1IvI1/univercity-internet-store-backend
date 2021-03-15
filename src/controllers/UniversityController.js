const databaseQuery = require("../index");

const getUniversities = () => {
  return databaseQuery.runQuery("SELECT id, shortName FROM universities;")
}

const getAllFaculties = id => {
  return databaseQuery.runQuery(`SELECT id, shortName FROM faculties;`)
}

const getAllGroups = id => {
  return databaseQuery.runQuery(`SELECT id, shortName FROM groups_fac;`)
}

const getFaculties = id => {
  return databaseQuery.runQuery(`SELECT id, shortName FROM faculties WHERE universities_id = ${id};`)
}

const getGroups = id => {
  return databaseQuery.runQuery(`SELECT id, shortName FROM groups_fac WHERE faculties_id = ${id};`)
}

const getLectures = id => {
  return databaseQuery.runQuery(`SELECT id, name FROM lectures WHERE groups_fac_id = ${id};`)
}

const getProfessors = id => {
  return databaseQuery.runQuery(`SELECT id, name FROM professors WHERE lectures_id = ${id};`)
}

module.exports = {
  getProfessors,
  getUniversities,
  getFaculties,
  getGroups,
  getAllFaculties,
  getAllGroups,
  getLectures,
}
