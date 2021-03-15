
const sendOnUserConnected = (subscribers, users, msg) => {
  console.log('Tryi9ng to broadcast post')
  users.forEach((x, i) => {
    if (subscribers.includes(i)) {
      console.log('broadcasting to i', i)
      x.send(JSON.stringify(msg))
    }
  })
}

module.exports = {
  sendOnUserConnected
}