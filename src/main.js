/**app.use(
 * async (next) => {
 *    await  next()
 * }
 * )**/

const http = require("http")
const request = require("./_proto_/request")
const response = require("./_proto_/response")
const context = require("./_proto_/context")

export default class application{
    constructor() {
        this.middleWareList=[]
        this.request = request
        this.response = response
        this.context = context
    }

    listen(...args){
        let server = http.createServer(this.callback());
        server.listen(...args)
    }

    composed(middleware){
        return function (ctx) {
            let index = -1;
            function dispatch(i) {
                index = i;
                let fn = middleware[i]
                if(!fn) return Promise.resolve()
                try{
                    return Promise.resolve(fn(ctx, function next() {
                        return dispatch(i+1)
                    }))
                }catch (e) {
                    return Promise.reject(e)
                }
            }
            return dispatch(0)
        }
    }

    createContext(req, res){
         let ctx = Object.create(this.context)
        ctx.request = Object.create(this.request)
        ctx.response = Object.create(this.response)
        ctx.req = ctx.request.req = req;
        ctx.res = ctx.response.res = res;
        return ctx
    }

    callback(){
        const fn = this.composed(this.middleWareList)
        return (req, res) => {
            let ctx = this.createContext(req, res)
            this.handleResponse(ctx, fn)
        }
    }

    handleResponse(ctx, fn){
        fn(ctx).then(() => {
            let res = ctx.body
            ctx.res.end(res)
        }).catch((err) => {
            console.error(err)
        })
    }

    use(middleWare){
        if(typeof middleWare !== 'function') throw TypeError("middleWare is not a function")
        this.middleWareList.push(middleWare)
        return this
    }

}
