const checkSubscription = (userId, users) => {
  return users.map(x => ({ ...x, isSubscribed: userId == x.subscriber }))
}

module.exports = {
  checkSubscription
}