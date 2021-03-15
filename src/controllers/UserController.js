const databaseQuery = require("../index");
const { checkSubscription } = require("./utils/ReworkSubscribers");

const getAllUsers = async (id) => {
  try {
    const userHasSubs = await databaseQuery.runQuery(`SELECT * FROM users_subscriptions WHERE subscriber = ${id};`)
    const response = await databaseQuery.runQuery(`SELECT u.id, name, email, gf.shortName AS groupName, fac.shortName AS facultyName, univ.shortName AS universityName, u.avatar FROM 
    (((
      users u JOIN groups_fac gf ON u.groups_id = gf.id)
      JOIN faculties fac ON fac.id = gf.faculties_id
      ) JOIN universities univ ON univ.id = fac.universities_id
      ) WHERE u.id != ${id}`);

      const subbedResponse = response.map(user => {
        return {...user, isSubscribed: !!userHasSubs.find(sub => sub.subscription == user.id)}
      })
      return subbedResponse
  }
  catch (err) {
    throw new Error(err)
  }
};

const getUserById = (handler, userId, ...parameters) => {
  return databaseQuery.runQuery(
    `SELECT ${parameters.reduce((acc, x, i, arr) => {
      const connector = i === arr.length - 1 ? "" : ", ";
      return (acc += `${x}${connector}`);
    }, "")} FROM users WHERE id = ${userId};`
  );
};

const checkUserExistance = ({ username, password }) => {
  return new Promise((accept) => {
    databaseQuery.runQuery(
      `SELECT id FROM users WHERE username = '${username}' AND password = '${password}';`

    ).then(result => {
      if (!result || result.length) {
        accept(true);
      } else {
        accept(false);
      }
    })
  });
};

const addAvatar = async (avatar, id) => {
  try {
    const query = `UPDATE users SET avatar = '${avatar}' WHERE id = ${id};`
    return await databaseQuery.runQuery(query)
  } catch (err) {
    throw new Error(err)
  }
}

const createNewUser = (
  { name, role, username, password, email, phone, groupId }
) => {
  const sql = `INSERT INTO users (name,role,username,password,email,phone, groups_id) VALUES 
  ('${name}','${"user"}','${username}','${password}','${email}','${phone}', ${groupId});`;
  return databaseQuery.runQuery(sql);
};

const getFilteredUsers = async ({ university, faculty, group, name, id }) => {
  try {
    if (university === 'null' && faculty === 'null' && group === 'null' && name === 'null') {
      return getAllUsers(id)
    }
    const userHasSubs = await databaseQuery.runQuery(`SELECT * FROM users_subscriptions WHERE subscriber = ${id};`)
    let query = `SELECT u.id, name, email, gf.shortName AS groupName, fac.shortName AS facultyName, univ.shortName AS universityName, u.avatar FROM 
    (((
      users u JOIN groups_fac gf ON u.groups_id = gf.id)
      JOIN faculties fac ON fac.id = gf.faculties_id
      ) JOIN universities univ ON univ.id = fac.universities_id
      ) WHERE u.id != ${id}`
    university !== 'null' && (query += ` AND univ.id = ${university}`)
    faculty !== 'null' && (query += ` AND fac.id = ${faculty}`)
    group !== 'null' && (query += ` AND gf.id = ${group}`)
    name !== 'null' && (query += ` AND name LIKE '%${name}%'`)
    query += ';'
    const response =  await databaseQuery.runQuery(query)
    const subbedResponse = response.map(user => {
      return {...user, isSubscribed: !!userHasSubs.find(sub => sub.subscription == user.id)}
    })
    return subbedResponse
  } catch (err) {
    throw new Error(err)
  }
}

const subscribeToUser = async ({ subscriberId, subscribtionId }) => {
  try {
    const checkUserSubsQuery = `SELECT subscription FROM users_subscriptions WHERE subscriber = ${subscriberId};`
    const userSubs = await databaseQuery.runQuery(checkUserSubsQuery)
    const subscriptionExists = userSubs.find(x => x.subscription == subscribtionId)
    if (subscriptionExists) {
      throw new Error("Subscription already exists")
    } else {
      const query = `INSERT INTO users_subscriptions(subscriber, subscription) VALUES (${subscriberId}, ${subscribtionId});`
      return await databaseQuery.runQuery(query)
    }
  } catch (err) {
    throw err
  }
}

const deleteSubscription = ({id, subscriptionId}) => {
  const query = `DELETE FROM users_subscriptions WHERE subscriber = ${id} AND subscription = ${subscriptionId}`
  return databaseQuery.runQuery(query)
}

const getUserAvatar = async (id) => {
  try {
    const query = `SELECT avatar FROM users WHERE id = ${id}`
    const response = await databaseQuery.runQuery(query)
    return response[0]
  } catch (err) {
    throw new Error(err)
  }
}

module.exports = {
  getFilteredUsers,
  getAllUsers,
  getUserById,
  checkUserExistance,
  createNewUser,
  subscribeToUser,
  deleteSubscription,
  addAvatar,
  getUserAvatar,
}
