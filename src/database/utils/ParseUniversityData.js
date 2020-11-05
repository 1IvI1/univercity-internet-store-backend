const universityData = require("./ExportedJSON");

const mergedData = [
  ...universityData.data1.universities,
  ...universityData.data2.universities
];

const createUniversitySqlScript = () => {
  let sql = "INSERT INTO universities(longName,shortName) VALUES (";
  let prevI = 0;
  mergedData.forEach((x, i, arr) => {
    const connector = i === arr.length - 1 ? "" : ", ";
    if (prevI < i || (i === 0 && sql.includes("VALUES ('"))) {
      sql = sql.slice(0, sql.lastIndexOf(","));
      sql += "),(";
    }
    sql += `'${x.fullUniversityName}','${x.shortUniversityName}'${connector}`;
    prevI = i;
  });
  sql += ");";
  return sql;
};

const createFacultiesSqlScript = () => {
  let sql =
    "INSERT INTO faculties(longName,shortName,universities_id) VALUES (";
  let prevI = 0;
  mergedData.forEach((univ, univI, univArr) => {
    univ.faculties.forEach((fac, facI, facArr) => {
      const connector =
        facI === facArr.length - 1 && univI === univArr.length - 1 ? " " : ", ";
      console.log("sql", sql);
      if (prevI < facI || (facI === 0 && sql.includes("VALUES ('"))) {
        sql = sql.slice(0, sql.lastIndexOf(","));
        sql += "),(";
      }
      sql += `'${fac.fullName}','${fac.shortName}',${univI + 1}${connector}`;
      console.log("univI", univI);
      prevI = facI;
    });
  });
  sql += ");";
  return sql;
};

const createGroupsSqlScript = () => {
  let sql = "INSERT INTO groups_fac(longName,shortName,faculties_id) VALUES (";
  let prevI = 0;
  mergedData.forEach((univ,univI, univArr) => {
    univ.faculties.forEach((fac, facI, facArr) => {
      fac.gropus.forEach((gr, grI, grArr) => {
        const connector =
          grI === grArr.length - 1 && univI === univArr.length - 1 && facI === facArr.length - 1 ? "" : ", ";
        if (prevI < grI || (grI === 0 && sql.includes("VALUES ('"))) {
          sql = sql.slice(0, sql.lastIndexOf(","));
          sql += "),(";
        }
        sql += `'${gr.fullName}','${gr.shortName}',${!!univI ? univI : ""}${!!univI ? facI : facI + 1}${connector}`;
        prevI = grI;
      });
    });
  });
  sql += ");";
  return sql;
};

console.log(
  createGroupsSqlScript()
  // .split("")
  // .reduce((acc, x) => {
  //   if (x === "(") {
  //     return (acc += 1);
  //   }
  //   return acc;
  // }, 0)
);

module.exports = {
  createUniversitySqlScript,
  createFacultiesSqlScript,
  createGroupsSqlScript
};
