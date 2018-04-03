const koa = require('koa')

const koaRouter = require('koa-router')
const koaCompose = require('koa-compose')

let app = new koa();

let router = new koaRouter();
router.get('/hello', async (ctx, next) => {
    // ctx.body = 'hello';
    throw new Error('heeee')
    // await name();
    return 1;
});

async function name(params) {
    throw new Error('sss')
}

app.use((ctx, next) => {
    next().then(x => {
        console.log('then', x);
    }).catch(err => {
        console.log('err', err);
    })
});


app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000);
