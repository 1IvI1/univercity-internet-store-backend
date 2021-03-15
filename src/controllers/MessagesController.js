const { onlineUsers, messagesUsers, chatUsers } = require("../websockets/InitWsServer");
const databaseQuery = require("../index");
const { sendOnUserConnected } = require("./utils/Broadcaster");

const sendMessage = ({ msg, chatId, authorId, authorName }) => {
  return databaseQuery.runQuery(`INSERT INTO messages(chats_id,text,createDate,author,authorName,isRead) VALUES (${chatId},'${msg}',NOW(), ${authorId}, '${authorName}', false);`)
}

const broadcastMessage = ({ msg, chatId, authorId, authorName }) => new Promise((accept, reject) => {
  let chatSubscribers = []
  const query = `SELECT users_id FROM users_has_chats as uhc INNER JOIN chats c ON c.id = uhc.chats_id WHERE c.id = ${chatId} AND users_id != ${authorId};`
  databaseQuery.runQuery(query).then(async (response) => {
    chatSubscribers = response.map(x => x.users_id)
    console.log('response chatSubscribers', chatSubscribers, response)
    const message = await getChatsLastMessage(+chatId)
    sendOnUserConnected(chatSubscribers, onlineUsers, message[0])
    sendOnUserConnected(chatSubscribers, messagesUsers, message[0])
    sendOnUserConnected(chatSubscribers, chatUsers, message[0])
    accept(message[0])
  })
})

const setMessageIsRead = msgId => {
  return databaseQuery.runQuery(`UPDATE messages SET isRead = 1 WHERE id = ${msgId};`)
}

const getAuthorLastMessagesQuery = (chatIds, authorId) => {
  let query = null
  if (!Array.isArray(chatIds)) {
    return null
  }
  if (chatIds.length === 1) {
    query = `SELECT messages.*, users.avatar, ch.name AS chatName FROM (messages JOIN users ON users.id = messages.author)
    JOIN chats ch ON ch.id = messages.chats_id WHERE chats_id = ${chatIds[0]} ORDER BY id DESC LIMIT 1;`

  } else {
    query = chatIds.reduce((acc, x, i) => {
      return acc += i < chatIds.length - 1 ? `(SELECT messages.*, users.avatar, ch.name AS chatName FROM (messages JOIN users ON users.id = messages.author)
      JOIN chats ch ON ch.id = messages.chats_id WHERE chats_id = ${x} ORDER BY id DESC LIMIT 1) UNION `
        : `(SELECT messages.*, users.avatar, ch.name AS chatName FROM (messages JOIN users ON users.id = messages.author)
        JOIN chats ch ON ch.id = messages.chats_id WHERE chats_id = ${x} ORDER BY id DESC LIMIT 1);`
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
        const query = getAuthorLastMessagesQuery([...responseMap], authorId)
        if (!query) {
          return reject({ errorMessage: `There is no chats for user ${authorId}` })
        }
        databaseQuery.runQuery(query)
          .then(response => {
            accept(response)
          })
      })

  })
}

const getChatMessages = (chatId) => {
  return databaseQuery.runQuery(`SELECT * FROM messages WHERE chats_id = ${chatId} ORDER BY createDate;`)
}

const getChatsLastMessage = (chatId) => {
  return databaseQuery.runQuery(`SELECT * FROM messages WHERE chats_id = ${chatId} ORDER BY id DESC LIMIT 1;`)
}


module.exports.sendMessage = sendMessage;
module.exports.broadcastMessage = broadcastMessage;
module.exports.getLastMessages = getLastMessages;
module.exports.getChatMessages = getChatMessages;
module.exports.setMessageIsRead = setMessageIsRead;
