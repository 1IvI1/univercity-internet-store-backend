const errorLogger = (error, status, res) => {
  let msg = '';
  if(error instanceof Error) {
    msg = error.toString()
  } else if(error instanceof String) {
    msg = error
  }
  res.status(status).json({errorMessage: msg})
}

module.exports = {
  errorLogger
}