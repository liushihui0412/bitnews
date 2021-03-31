// 引入express包
const express = require('express')
    // 创建服务
const server = express()

// 开启cors跨域
const cors = require('cors')
server.use(cors())

// 设置uploads为静态资源目录
server.use('/uploads', express.static('uploads'))

// 设置express-jwt第三方包用于token生成和验证
const jwt = require("express-jwt");
// app.use(jwt().unless());
// jwt() 用于解析token，并将 token 中保存的数据 赋值给 req.user
// unless() 约定某个接口不需要身份认证
server.use(jwt({
    secret: 'gz61', // 生成token时的 钥匙，必须统一
    algorithms: ['HS256'] // 必填，加密算法，无需了解
}).unless({
    path: ['/api/login', '/api/reguser', /^\/uploads\/.*/] // 除了这两个接口，其他都需要认证
}));

// 通过路由中间件来 加载不同的路由
const accountRouter = require('./router/account_router')
const cateRouter = require('./router/cate_router')
const userRouter = require('./router/user_router')
server.use('/api', accountRouter)
server.use('/my/article', cateRouter)
server.use('/my', userRouter)

// 错误处理中间件用来检查token合法性
server.use((err, req, res, next) => {
    console.log('有错误', err)
    if (err.name === 'UnauthorizedError') {
        // res.status(401).send('invalid token...');
        res.status(401).send({ code: 1, message: '身份认证失败！' });
    }
});

server.listen('3000', () => {
    console.log('3000端口已准备就绪！');
})