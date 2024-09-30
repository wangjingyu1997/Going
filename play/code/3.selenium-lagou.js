import { Builder, Browser, By, Key } from 'selenium-webdriver'
import fs from 'fs'
import delay from 'delay'
// 构建一个 webdriver 就一个浏览器
const driver = await new Builder().forBrowser(Browser.EDGE).build();
(async function start() {
  await driver.manage().window().maximize()
  // 打开网站
  await driver.get('https://www.lagou.com/')
  // 删除所有 cookies
  await driver.manage().deleteAllCookies()
  // 导入所有的cookies
  const cookies = JSON.parse(fs.readFileSync('./cookies.json', 'utf-8'))
  // console.log(cookies)
  for (let i = 0; i < cookies.length; i++) {
    await driver.manage().addCookie(cookies[i])
  }
  // 再次打开网站让 cookies 生效
  await driver.get('https://www.lagou.com/')

  // setTimeout(async() => {
  //   const cookies = await driver.manage().getCookies()
  //   console.log(cookies)
  //   fs.writeFileSync('cookies.json', JSON.stringify(cookies))
  // }, 10000)
  try {
    await driver.findElement(By.css('.tab.focus')).click()
  } catch(e) {}
  // 用代码来操作浏览器获取元素, 并键入一个关键字 webdriver
  // By.name 属性选择器 name
  // By.css css 选择器
  // sendKeys 发送文本内容到文本框 Key.RETURN 按下回车
  await driver.findElement(By.css('#search_input')).sendKeys('前端', Key.RETURN);
  await delay(1000)
  // 获取所有可以点击的城市
  const cities = await driver.findElements(By.css('.option__2xJt5'))
  // 查找文本内容为北京的 div 让它被点击
  for (let i = 0; i < cities.length; i++) {
    const city = cities[i]
    const text = await city.getText()
    if (text === cityArr[cityIndex]) {
      await city.click()
      break
    }
  }
  await getData()
})();

let low = 0 // 10K 以下的岗位数量
let mid = 0 // 10K ~ 20K 的岗位数量
let high = 0 // 20K 以上的岗位数量

let currentPage = 1 // 当前第几页
const maxPage = 15 // 最大页数 30 页
const cityArr = ['北京', '上海', '广州', '深圳', '武汉']
let cityIndex = 0
const results = []

async function getData() {
  console.log(`---正在获取${cityArr[cityIndex]}的第${currentPage}页数据---`)
  await delay(3000)
  // 获取所有条目
  const items = await driver.findElements(By.css('.item__10RTO'))
  // console.log(items.length)
  const moneys = await Promise.all(items.map(item => item.findElement(By.css('.money__3Lkgq')).getText()))
  // console.log(moneys)
  moneys.forEach(item => {
    const money = item.split('-')[0].slice(0, -1)
    money < 10 && low++
    money >= 10 && money < 20 && mid++
    money >= 20 && high++
  })
  console.log(low, mid, high)

  // 获取完当前页的数据了
  if (currentPage < maxPage) {
    await driver.findElement(By.css('.lg-pagination-next .lg-pagination-item-link')).click()
    currentPage++
    await getData()
  } else {
    // 说明已经把当前城市获取完成了
    // 存储结果
    results.push({
      city: cityArr[cityIndex],
      low,
      mid,
      high
    })
    // 写入到本地
    fs.writeFileSync('./results.json', JSON.stringify(results))
    console.log(results)

    // 城市索引自增并判断还有没有城市, 没有就直接结束
    if (!cityArr[++cityIndex]) return

    // 让指定的城市被点击
    // 获取所有可以点击的城市
    const cities = await driver.findElements(By.css('.option__2xJt5'))
    // 查找文本内容为指定城市的 div 让它被点击
    for (let i = 0; i < cities.length; i++) {
      const city = cities[i]
      const text = await city.getText()
      if (text === cityArr[cityIndex]) {
        await city.click()
        break
      }
    }

    // 重置条件
    currentPage = 1
    low = mid = high = 0

    // 继续递归调用
    await getData()
  }
}