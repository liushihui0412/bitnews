const express = require('express')
const conn = require('../util/sql.js')

// 使用express下的Router方法，设置路由
const router = express.Router()
router.use(express.urlencoded())

// 实现获取文章分类列表接口代码/my/article/cates
router.get('/cates', (req, res) => {

    const sqlStr = `select * from categories`
    conn.query(sqlStr, (err, result) => {
        console.log(err);
        console.log(result);
        if (err) return res.status(500).json({ status: 500, message: "服务器出错" })
        res.status(200).json({ status: 0, message: "获取文章分类列表成功！", data: result })
    })
})

// 实现新增文章分类接口代码/my/article/addcates
router.post('/addcates', (req, res) => {
    const { name, slug } = req.body

    // sql语句
    const sqlStr = `insert into categories(name,slug) values("${name}","${slug}")`
    conn.query(sqlStr, (err, result) => {
        console.log(err, result);
        if (err) return res.status(500).json({ status: 500, message: "服务器出错" })
        if (result.affectedRows > 0) {
            res.status(200).json({ status: 0, message: "新增文章分类成功" })
        } else {
            res.status(201).json({ status: 1, message: "新增文章分类失败" })
        }
    })
})

// 实现根据id删除分类接口代码/my/article/deletecate
router.get('/deletecate', (req, res) => {
    const { id } = req.query
    const sqlStr = `delete from categories where id=${id}`
    conn.query(sqlStr, (err, result) => {
        if (err) return res.status(500).json({ status: 500, message: "服务器出错" })
        if (result.affectedRows > 0) {
            res.status(200).json({ status: 0, message: "删除文章分类成功" })
        } else {
            res.status(201).json({ status: 1, message: "删除文章分类失败" })
        }
    })
})

// 实现根据id获取分类数据接口代码/my/article/getCatesById
router.get('/getCatesById', (req, res) => {
    const { id } = req.body

    // sql语句
    const sqlStr = `select * from categories where id=${id}`
    conn.query(sqlStr, (err, result) => {
        console.log(err);
        console.log(result);
        if (err) return res.status(500).json({ status: 500, message: "服务器出错" })
        res.status(200).json({ status: 0, message: "获取文章分类列表成功！", data: result[0] })
    })
})

// 实现更新分类数据接口代码/my/article/updatecate
router.post('/updatecate', (req, res) => {
    const { id, name, slug } = req.body

    // sql语句
    const sqlStr = `update categories set name="${name}",slug="${slug}" where id=${id}`
    conn.query(sqlStr, (err, result) => {
        console.log(err);
        console.log(result);
        if (err) return res.status(500).json({ status: 500, message: "服务器出错" })
        res.status(200).json({ status: 0, message: "更新分类信息成功!", data: result[0] })
    })
})

module.exports = router