const databaseQuery = require("../index");

const universityScripts = require("./utils/ParseUniversityData");

// databaseQuery.runQuery(universityScripts.createUniversitySqlScript(), () => {
  // databaseQuery.runQuery(universityScripts.createFacultiesSqlScript(), () => {
    databaseQuery.runQuery(
      universityScripts.createGroupsSqlScript(),
      result => {
        console.log("createGroupsSqlScript result", result);
      }
    );
  // });
// });
