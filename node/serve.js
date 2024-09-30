const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, './pubilc')));

// 简单的 AI bot 响应
const responses = {
    "你好": "你好！请问我能帮你什么？",
    "你好吗": "我很好，谢谢！你呢？",
    "再见": "再见！祝你有美好的一天！"
};

app.post('/message', (req, res) => {
    const userMessage = req.body.message.trim();
    const botResponse = responses[userMessage] || "对不起，我不明白你说的是什么。";
    res.json({ reply: botResponse });
});

app.listen(port, () => {
    console.log(`服务器正在运行在 http://localhost:${port}`);
});