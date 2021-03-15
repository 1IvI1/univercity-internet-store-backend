const databaseQuery = require("../index");
const { newsUsers } = require("../websockets/InitWsServer");
const { sendOnUserConnected } = require("./utils/Broadcaster");

const getFileById = (id) => {
  return databaseQuery.runQuery(`SELECT file FROM files WHERE posts_id = ${id};`)
}

const saveFile = (data, id) => {
  return databaseQuery.runQuery(`INSERT INTO files(file, posts_id) VALUES('${data}', ${id});`)
}

const getUserSubscriptions = async (id) => {
  console.log('getUserSubscriptions', getUserSubscriptions)
  return await databaseQuery.runQuery(`SELECT subscription FROM users_subscriptions WHERE subscriber = ${id};`)
}

const getPostFiles = async (postId) => {
  return await databaseQuery.runQuery(`SELECT file FROM files WHERE posts_id = ${postId};`)
}

const getSubsPosts = async (userId) => {
  return new Promise(async (accept, reject) => {
    try {
      const posts = []
      const userSubscriptions = await getUserSubscriptions(userId)
      console.log('userSubscriptions', userSubscriptions);
      if (!userSubscriptions || !userSubscriptions.length) {
        return accept([])
      }
      userSubscriptions.forEach((x, i) => {
        // if(userSubscriptions.length - 1 === i && posts.length === 0) {
        //   accept(posts)
        // }
        databaseQuery.runQuery(`SELECT p.*, u.avatar FROM posts p JOIN users u ON p.users_id = u.id WHERE users_id = ${x.subscription}`)
          .then(response => {
            response.length && response.forEach((postus, poi) => {
              let { post, files } = { post: postus }
              getPostFiles(postus.id).then(filos => {
                files = filos.map((x) => x.file)
                posts.push({ post, files })
                if (poi === response.length - 1 && files) {
                  accept(posts.reverse())
                }
              })
            })
          })
      })
    } catch (err) {
      reject(err)
    }
  })
}

const getUsersPosts = async (userId) => {
  return new Promise(async (accept, reject) => {
    try {
      const posts = []
      databaseQuery.runQuery(`SELECT * FROM posts WHERE users_id = ${userId}`)
        .then(response => {
          if (response.length) {
            response.forEach((postus, poi) => {
              console.log('postus', postus)
              let { post, files } = { post: postus }
              getPostFiles(postus.id).then(filos => {
                files = filos.map((x) => x.file)
                posts.push({ post, files })
                if (poi === response.length - 1 && files) {
                  console.log('posts', posts)
                  accept(posts.reverse())
                }
              })
            })
          } else {
            accept([])
          }

        })
    } catch (err) {
      reject(err)
    }
  })
}

const savePost = (data) => {
  const {
    userId,
    group,
    professor,
    course,
    comment,
    likes,
    semester,
    subject,
    lecture,
    faculty,
    university } = data
  return databaseQuery.runQuery(`INSERT INTO posts(users_id,getlab_demo.posts.group,professor,course,comment,likes,semester,subject,lecture,faculty,university, createDate) VALUES(${userId},'${group}','${professor}','${course}','${comment}',${likes},${semester},'${subject}','${lecture}','${faculty}','${university}', NOW());`)
}

const broadcastPost = async ({ userId, postData }) => {
  try {
    console.log('{userId, postData}', { userId, postData })
    let subscribers = []
    const subscribersQuery = `SELECT subscriber FROM users_subscriptions WHERE subscription = ${userId}`
    const requestedSubscribers = await databaseQuery.runQuery(subscribersQuery)
    subscribers = [...subscribers, ...requestedSubscribers.map(x => x.subscriber)]
    console.log('subscribers', subscribers, requestedSubscribers)
    sendOnUserConnected(subscribers, newsUsers, postData)
  } catch (err) {
    throw new Error(err)
  }
}

module.exports = {
  getFileById,
  saveFile,
  savePost,
  getSubsPosts,
  getUsersPosts,
  broadcastPost
}