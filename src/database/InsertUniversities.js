const databaseQuery = require("../index");

const universityScripts = require("./utils/ParseUniversityData");

// databaseQuery.runQuery(universityScripts.createUniversitySqlScript(), () => {
// databaseQuery.runQuery(universityScripts.createFacultiesSqlScript(), () => {
// databaseQuery.runQuery(
//   universityScripts.createGroupsSqlScript(),
//   result => {
//     console.log("createGroupsSqlScript result", result);
//   }
// );
// });
// });

// databaseQuery.runQuery(universityScripts.insertLectures()).then(response => {
//   console.log('response', response)
// })

databaseQuery.runQuery("SELECT * FROM lectures;").then(response => {
  // console.log('response', response)
  let query = "INSERT INTO professors(name, surname, lectures_id) VALUES"
  response.forEach((x,i) => {
    console.log('x', x)
    query += `('${'test' + x.id + Math.random()}','${'test' + Math.random()}', ${x.id})${i === response.length - 1 ? '' : ','}`
  })
  query += ';'
  console.log(query)
  databaseQuery.runQuery(query).then(response => {
    console.log('response', response)
  })
})