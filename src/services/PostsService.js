const express = require("express");
const router = express.Router();
const multer = require('multer')
const { getFileById, saveFile, savePost, getSubsPosts, getUsersPosts, broadcastPost } = require("../controllers/PostsController");
const { errorLogger } = require("../utils/Logger");
const { parseJwt } = require("../websockets/utils");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './files/')
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
})

const upload = multer({ storage: storage })

router.use("/uploads", express.static('files'))

router.post("/send", upload.single('file'), async (req, res, next) => {
  try {
    const data = req.body
    const user = parseJwt(req.headers['access-token'])
    const file = req.file
    console.log({
      token: req.headers['access-token'], data,
      user,
      file
    })
    const response = await savePost({
      userId: user.id,
      group: data.group,
      professor: data.professor,
      course: data.course,
      comment: data.comment,
      likes: 0,
      semester: data.semester,
      subject: data.subject,
      lecture: data.lecture,
      faculty: data.faculty,
      university: data.university
    })
    await saveFile(file.filename, response.insertId)
    const postData = {
      file: [file.filename],
      post: {
        comment: data.comment,
        course: data.course,
        createDate: new Date(),
        faculty: data.faculty,
        group: data.group,
        id: response.insertId,
        lecture: data.lecture,
        likes: 0,
        professor: data.professor,
        semester: data.semester,
        subject: data.subject,
        university: data.university,
        users_id: user.id
      }
    }
    await broadcastPost({ userId: user.id, postData })
    res.sendStatus(200)
  } catch (err) {
    errorLogger(err, 400, res)
  }
})

router.get('/file/:id', async (req, res) => {
  try {
    const id = req.params.id
    const response = await getFileById(id)
    console.log('response', response)
    res.send(`http://localhost:4000/post/uploads/${response[0].file}`)
    // res.sendFile(`uploads/${response[0].file}`)
  } catch (err) {
    res.sendStatus(400)
  }
})

router.get('/get', async (req, res) => {
  try {
    const user = parseJwt(req.headers['access-token'])
    const response = await getSubsPosts(user.id)
    console.log('posts get', user.id, response)
    res.send(response)
  } catch (err) {
    res.sendStatus(400)
  }
})

router.get('/get-users-posts/:id', async (req, res) => {
  try {
    const id = req.params.id
    const response = await getUsersPosts(id)
    res.send(response)
  } catch (err) {
    errorLogger(err, 400, res)
  }
})

module.exports = router