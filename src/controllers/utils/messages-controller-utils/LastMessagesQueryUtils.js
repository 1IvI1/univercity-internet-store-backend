const createLastMessagesQuery = (chatIds) => {
  if (!Array.isArray(chatIds)) {
    return null
  }

  if (chatIds.length === 0) {
    return null
  }

  if (chatIds.length === 1) {
    return `SELECT * FROM messages WHERE chats_id = ${chatIds[0]} ORDER BY id DESC LIMIT 1;`
  }

  let query = chatIds.reduce((acc, x, i) =>
    acc += `SELECT * FROM messages WHERE chats_id = ${x} ORDER BY id DESC LIMIT 1 ${i < chatIds.length ? " UNION " : ""}`,"")

  return query + ";"
}

module.exports.createLastMessagesQuery = createLastMessagesQuery