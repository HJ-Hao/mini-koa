import application from './main'
let a = new application()

//中间件必须调用next方法 不然会提起返回

a.use(async (ctx, next) => {
    console.log('before_1')
    await next()
    console.log('after_1')
})

a.use(async (ctx ,next) => {
    console.log('before_2')
    await next()
    console.log('after_2')
})

a.use(async ctx => {
    ctx.body = 'hello world'
});

a.listen(3000)