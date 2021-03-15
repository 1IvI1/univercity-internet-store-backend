const databaseQuery = require("../index");

const getUsersProfileData = async (id) => {
  try {
    const query = `SELECT u.avatar, u.id, univ.longName AS university, fac.longName AS faculty, gr.longName AS 'group', u.name, u.email, u.phone AS number, u.course  FROM 
    (((
      users u JOIN groups_fac gr ON u.groups_id = gr.id
      ) 
      JOIN faculties fac ON fac.id = gr.faculties_id
      )
      JOIN universities univ ON univ.id = fac.universities_id
      ) WHERE u.id = ${id};`
    const userData = await databaseQuery.runQuery(query)
    const subscriptions = await databaseQuery.runQuery(`SELECT subscriber FROM users_subscriptions WHERE subscriber = ${id};`)
    const subscribers = await databaseQuery.runQuery(`SELECT subscription FROM users_subscriptions WHERE subscription = ${id};`)
    return {
      ...userData[0],
      subscriptions: subscriptions.length,
      subscribers: subscribers.length
    }
  } catch (err) {
    throw new Error(err)
  }
}

module.exports = {
  getUsersProfileData
}