const databaseQuery = require("../index");

const createChat = ({userIds, name}) => {
  return databaseQuery.runQuery(`INSERT INTO chats(name) VALUES ('${name}');`).then(response => {
    connectUsersToChat(userIds, response.insertId)
    return response.insertId
  })
}

const connectUsersToChat = (userIds, chatId) => {
  console.log('userIds', userIds)
  userIds.forEach(id => {
    console.log('id', id)
    databaseQuery.runQuery(`INSERT INTO users_has_chats(users_id, chats_id) VALUES (${id},${chatId});`).then(() => {
      console.log('Linked users with chat', chatId)
    }).catch(err => {
      console.log(`Error while linking chat: ${chatId}`, err)
    })
  })
}

module.exports.createChat = createChat