import { Builder, Browser, By, Key, until } from 'selenium-webdriver'

(async function example() {
  // 构建一个 webdriver 就一个浏览器
  let driver = await new Builder().forBrowser(Browser.EDGE).build();
  try {
    // 打开网站
    await driver.get('https://www.baidu.com');
    // 用代码来操作浏览器获取元素, 并键入一个关键字 webdriver
    // By.name 属性选择器 name
    // By.css css 选择器
    // sendKeys 发送文本内容到文本框 Key.RETURN 按下回车
    await driver.findElement(By.css('#kw')).sendKeys('黑马程序员', Key.RETURN);
  } finally {
    // 关闭浏览器
    // await driver.quit();
  }
})();