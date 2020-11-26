const onlineUsers = require("../websockets/InitWsServer").onlineUsers;
const databaseQuery = require("../index");

const sendMessage = ({ msg, chatId, authorId }) => {
  return databaseQuery.runQuery(`INSERT INTO messages(chats_id,text,createDate,author) VALUES (${chatId},'${msg}',NOW(), ${authorId});`)
}

const broadcastMessage = ({ msg, chatId, authorId }) => new Promise((accept, reject) => {
  let chatSubscribers = []
  const query = `SELECT users_id FROM users_has_chats as uhc INNER JOIN chats c ON c.id = uhc.chats_id WHERE c.id = ${chatId} AND users_id != ${authorId};`
  databaseQuery.runQuery(query).then(response => {
    chatSubscribers = response.map(x => x.users_id)
    console.log('response chatSubscribers', response)
    onlineUsers.forEach((x, i) => {
      if (chatSubscribers.includes(i)) {
        x.send(JSON.stringify({ msg, chatId, authorId }))
      }
    })
    accept(response)
  })
})

const getAuthorLastMessagesQuery = (chatIds) => {
  let query = null
  if (!Array.isArray(chatIds)) {
    return null
  }
  if (chatIds.length === 1) {
    query = `SELECT * FROM messages WHERE chats_id = ${chatIds[0]} ORDER BY id DESC LIMIT 1;`

  } else {
    query = chatIds.reduce((acc, x, i) => {
      return acc += i < chatIds.length - 1 ? `(SELECT * FROM messages WHERE chats_id = ${x} ORDER BY id DESC LIMIT 1) UNION `
        : `(SELECT * FROM messages WHERE chats_id = ${x} ORDER BY id DESC LIMIT 1);`
    }, "")
  }
  return query
}

const getLastMessages = (authorId) => {
  return new Promise((accept, reject) => {
    databaseQuery.runQuery(`SELECT chats_id FROM users_has_chats WHERE users_id = ${authorId};`)
      .then(response => {
        let responseMap = null
        if (!Array.isArray(response) && !response.length) {
          return reject({ errorMessage: "Author doesn't have chats" })
        }
        responseMap = new Set(response.map(x => x.chats_id))
        console.log([...responseMap])
        const query = getAuthorLastMessagesQuery([...responseMap])
        if(!query) {
          return reject({errorMessage: `There is no chats for user ${authorId}`})
        }
        databaseQuery.runQuery(query)
          .then(response => {
            accept(response)
          })
      })

  })
}


module.exports.sendMessage = sendMessage;
module.exports.broadcastMessage = broadcastMessage;
module.exports.getLastMessages = getLastMessages;
