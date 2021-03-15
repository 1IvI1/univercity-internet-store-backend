const databaseQuery = require("../index");

const getAmISubscribed = async (id, potentialSubId) => {
  try {
    const query = `SELECT subscriber FROM users_subscriptions WHERE subscription = ${id};`
    const response = await databaseQuery.runQuery(query)
    const amIsub =  !!response.find(x => x.subscriber == potentialSubId)
    return amIsub
  } catch(err) {
    throw new Error(err)
  }
}

module.exports = {
  getAmISubscribed
}