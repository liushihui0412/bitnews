const express = require('express')
const conn = require('../util/sql.js')

// 使用express下的Router方法，设置路由
const router = express.Router()
router.use(express.urlencoded())

// 上传文件索要用到的包
const multer = require('multer')

// 引入path包，取文件后缀名
const path = require('path')

const storage = multer.diskStorage({
    // 保存在哪里
    destination: function(req, file, cb) {
        cb(null, 'uploads');
    },
    // 保存时，文件名叫什么
    filename: function(req, file, cb) {
        // console.log('file', file)
        // 目标： 新名字是时间戳+后缀名
        const fileExtname = path.extname(file.originalname);
        // filenameArr.length-1是找到最后一个元素的下标
        // const fileName = Date.now() + "." + filenameArr[filenameArr.length - 1]
        // 时间戳+原图片文件的后缀名
        const fileName = Date.now() + fileExtname;
        cb(null, fileName) //
    }
})

// 精细化去设置，如何去保存文件
const upload = multer({ storage })


// 获取用户的基本信息接口/my/userinfo
router.get('/userinfo', (req, res) => {
    // get请求的参数存放在req.query中
    console.log('请求到的参数：', req.query);
    const { username } = req.body

    // 写sql语句
    const sqlStr = `select * from users where username="${username}"`

    // 执行sql
    conn.query(sqlStr, (err, result) => {
        if (err) return res.status(500).json({ status: 500, message: "服务器出错" })

        // console.log(result);
        // 因为result是一个数组，而我们要的数据是对象，所以需要要取出来
        const data = result[0]
        if (result.length > 0) {
            res.status(200).json({ status: 0, message: "获取用户基本信息成功！", data })
        } else {
            res.status(201).json({ status: 1, message: "获取用户基本信息失败" })
        }
    })
})

// 上传用户头像接口代码/my/uploadPic
router.post('/uploadPic', upload.single('file_data'), (req, res) => {
    console.log('本次上传的头像文件是:', req.file);
    const { filename } = req.file
    res.json({
        status: 0,
        message: "http://127.0.0.1:3000/uploads/" + filename
    })
})

// 实现更新用户接口代码/my/userinfo
router.post('/userinfo', (req, res) => {
    const { id, nickname, email, userPic } = req.body

    // 拼接sql语句
    const sqlStr = `update users set nickname="${nickname}",email="${email}",userPic="${userPic}" where id=${id}`

    // 执行sql语句
    conn.query(sqlStr, (err, result) => {
        // 出错情况处理
        if (err) return res.status(500).json({ status: 500, message: "服务器出错" })

        console.log(result);
        // 正确情况处理
        if (result.affectedRows > 0) {
            res.status(200).json({ status: 0, message: "修改用户信息成功！" })
        } else {
            res.status(201).json({ status: 1, message: "修改用户信息失败！" })
        }

    })
})

// 实现重置用户密码接口代码/my/updatepwd
router.post('/updatepwd', (req, res) => {
    const { id, oldPwd, newPwd } = req.body

    // 拼接sql语句
    const sqlSelect = `select password from users where id=${id}`

    // 执行sql语句
    conn.query(sqlSelect, (err, result) => {
        console.log(err);
        console.log(result);

        // 出错情况处理
        if (err) return res.status(500).json({ status: 500, message: "服务器出错" })

        // 判断：如果新密码=旧密码，就报错
        if (result[0].password !== oldPwd) {
            // console.log(err);
            return res.status(201).json({ status: 1, message: "旧密码不正确" })
        }

        // 正确情况处理
        const sqlStr = `update users set password="${newPwd}" where id="${id}"`

        conn.query(sqlStr, (err, result) => {
            // console.log(err);
            console.log(result);
            if (err) return res.status(500).json({ status: 500, message: "服务器出错" })

            res.status(200).json({ status: 0, message: "修改密码成功！" })

        })
    })
})

module.exports = router