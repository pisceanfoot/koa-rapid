const koa = require('koa')

const koaRouter = require('koa-router')
const koaCompose = require('koa-compose')

let app = new koa();

let router = new koaRouter();
router.get('/hello',  async (ctx, next) => {
    // ctx.body = 'hello';
    throw new Error('heeee')
    // await name();
    return 1;
});
let router2 = new koaRouter();
router2.get('/hello2', async (ctx, next) => {
    ctx.body = 'hello';
    // throw new Error('heeee')
    // await name();
    return 1;
});

let aaa = koaCompose([
    router.routes(),
    router.allowedMethods(),
    router2.routes(),
    router2.allowedMethods()
]);

async function name(params) {
    throw new Error('sss')
}

app.use((ctx, next) => {
    next().then( x=> {
        console.log('then', x);
    }).catch(err => {
        console.log('err', err);
    })
});


app.use(aaa);
// app.use(router.routes());
// app.use(router.allowedMethods());

app.listen(3000);
