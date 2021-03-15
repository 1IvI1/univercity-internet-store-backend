const singlifyAray  = (arr) => {
  if(!Array.isArray(arr)) {
    return null;
  }
  const singlifyingObj = arr.reduce((acc, x) => ({...acc, [x.id]: x}))
  console.log('Object.values(singlifyingObj)', Object.values(singlifyingObj),singlifyingObj)
  return Object.values(singlifyingObj)
}

module.exports = {
  singlifyAray
}