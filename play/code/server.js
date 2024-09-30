import express from 'express'
import fs from 'fs'

// 创建一个 express 服务器
const server = express()

// 静态资源托管
server.use(express.static('./public'))

server.get('/salary', (req, res) => {
  const results = fs.readFileSync('./results.json', 'utf-8')
  res.send(results)
})

server.listen(3000, () => {
  console.log('http://localhost:3000')
})