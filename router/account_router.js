const express = require('express')

// 使用express下的Router方法，设置路由
const router = express.Router()
const conn = require('../util/sql.js')
const jwt = require('jsonwebtoken');
router.use(express.urlencoded())

// 实现注册用户接口 /api/reguser
router.post('/reguser', (req, res) => {
    // console.log('收到的参数为：', req.body);
    // 把收到的参数解构
    const { username, password } = req.body

    // 分析：注册不能有相同的用户名，所以要先判断数据库中有无相同的用户名
    // 1、拼接sql语句
    const sqlSelect = `select * from users where username="${username}" and password="${password}"`
        // 2、执行sql语句
    conn.query(sqlSelect, (err, result) => {
        console.log(err);
        console.log(result);
        if (err) return res.status(500).json({ status: 500, message: "服务器出错" })

        // 如果在数据库中查询出有其他的数据，就return
        if (result.length > 0) {
            return res.status(201).json({ status: 1, message: "注册失败，用户名已存在！" })
        }
        // 把数据放进数据库
        // 拼接sql语句
        const sqlStr = `insert into users(username,password) values("${username}","${password}")`

        // 执行sql语句
        conn.query(sqlStr, (err, result) => {
            console.log(err);
            console.log(result);

            // 错误，返回500转态码，并返回json数据
            if (err) return res.status(500).json({ status: 1, message: "服务器出错" })

            // 成功，返回200转态码，并返回json数据
            res.status(200).json({ status: 0, message: "注册成功" })
        })
    })
})

// 实现登录用户接口代码/api/login
router.post('/login', (req, res) => {
    // 解构收到的参数
    const { username, password } = req.body

    // 制作token
    const token = 'Bearer ' + jwt.sign({ name: username }, 'gz61', { expiresIn: "2h" })
        // 写sql查询语句
    const sqlStr = `select * from users where username="${username}" and password="${password}"`
        // 把数据放进数据库
    conn.query(sqlStr, (err, result) => {
        console.log(err);
        console.log(result);
        // 如果有err，就提示500状态码
        if (err) return res.status(500).json({ status: 500, message: "服务器出错" })

        // 如果查询到的数据长度>0，代表有这个用户，提示成功，如果没有就提示失败
        if (result.length > 0) {
            res.status(200).json({ status: 0, message: "登录成功", token })
        } else {
            res.status(201).json({ status: 1, message: "登录失败，用户名密码不对" })
        }
    })
})

module.exports = router