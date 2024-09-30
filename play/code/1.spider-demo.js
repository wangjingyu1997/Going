import axios from 'axios'
import cheerio from 'cheerio'
import download from 'download'
import fs from 'fs'

// 入门款爬虫
// 需求: 自动下载黑马程序员所有老师的帅照
// 步骤
// 1. 发起 HTTP 请求, 获取到当前网页 (借助 axios)
// 2. 使用 cheerio 解析网页
// 3. 下载
async function getData() {
  // 发请求获取网页源码
  const res = await axios.get('https://www.itheima.com/teacher.html#aweb')
  // console.log(res.data)
  // 使用 cheerio 解析网页源码
  const $ = cheerio.load(res.data)
  // console.log($('.tea_box2 .tea1_hd h2').text())
  // console.log($('.tea_main .tea_con img'))
  // 使用选择器解析所有的 img 的 src 属性
  const imgReg = /\.jpg|jpeg|png|bmp|gif$/
  const imgs = Array.from($('.tea_main .tea_con img')).map(img => 'https://www.itheima.com/' + encodeURI($(img).attr('src'))).filter(img => imgReg.test(img))
  // console.log(...imgs)
  // await Promise.all(imgs.map(url => download(url, 'dist')))
  if (!fs.existsSync('dist')) fs.mkdirSync('dist')
  imgs.forEach(async img => {
    fs.writeFileSync('dist/' + decodeURI(img).split('/').pop(), await download(img))
  })
}

getData()
