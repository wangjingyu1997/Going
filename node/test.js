const Koa = require("koa") // 导入koa
const Router = require("koa-router") //导入koa-router
const mysql = require("mysql")  // 导入mysql，连接mysql 需要用到
const koaNunjucks = require('koa-nunjucks-2');
const path = require('path');
const app = new Koa(); // 实例化koa
const router = new Router();
app.use(koaNunjucks({
    ext: 'html', // html文件的后缀名
    path: path.join(__dirname, 'views'), // 视图文件放在哪个文件夹下
    nunjucksConfig: {
        trimBlocks: true // 自动去除 block/tag 后面的换行符
    }
}));

// mysqljs 连接 mysql数据库
let connection = mysql.createConnection({
    host: '127.0.0.1', // mysql所在的主机，本地的话就是 127.0.0.1 或者 localhost, 如果数据库在服务器上，就写服务器的ip
    user: 'test', // mysql的用户名
    password: '123456', // mysql的密码
    database: 'testTable' // 你要连接那个数据库
})

// 连接 mysql
connection.connect(err => {
    // err代表失败
    if (err) {
        console.log("数据库初始化失败", err);
    } else {
        console.log("数据库初始化成功");
    }
})

// 创建一个路径为/hello的get请求
router.get("/hello", async ctx => {
    // 返回 字符串 hello
    ctx.body = "hello"

})

// koa注册路由相关
app
    .use(router.routes())
    .use(router.allowedMethods())
    // 监听端口
    .listen(3333, () => {
        console.log("server running port:" + 3333);
    })
const selectSql = "SELECT * FROM weapon"

// 因为 mysqljs不支持 Promise方式CRUD数据
function resDb(sql, params) {
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, res) => {
            console.log(sql)
            if (err) {
                reject(err)
            } else {
                resolve(res)
            }
        })
    })
}


router.get("/userAll", async ctx => {
    const userAll = await resDb("SELECT * FROM weapon")
    await ctx.render("table", { userAll })
})
//请求 /addUser 接受前端传过来的数据，并且把数据持久化到数据库中
router.get("/addUser", async ctx => {
    const { name, price } = ctx.query
    if (price && name) {
        await resDb(`INSERT INTO weapon (name , price) values (${name},${price})`)
        //重定向路由，到 userAll
        ctx.redirect("/userAll")
    }

})