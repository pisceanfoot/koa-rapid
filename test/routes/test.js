const Koaf1 = require('../..');

let router = Koaf1.router();

router.get('/hello', async function (ctx, next) {
    ctx.body = {hello: 'x'};
});

router.get('/settime_error', async function (ctx, next) {
    console.log('settime_error');
    throw new Error('sss throw sss tttt');
    // next();
    // await ttt();
   return 1;
});

async function ttt() {
    throw new Error('sss throw sss tttt');
}


module.exports = router;
