const KoaRapid = require('../..');

let router = KoaRapid.router();

router.get('/hello', async function (ctx, next) {
    ctx.body = {hello: 'x-index'};
});

router.get('/settime_error', async function (ctx, next) {
    console.log('settime_error');
    throw new Error('sss throw sss tttt');
    // next();
    // await ttt();
   return 1;
});

router.get('/settime_err2', async function (ctx, next) {
    console.log('settime_error2');

    // try{
    //     setTimeout(() => {
    //         throw new Error('1err in timeout');
    //     }, 10);
    // }catch(err){
    //     console.log('err catched', err);
    // }

    a=b;
    
    // next();
    // await ttt();
    ctx.body = 1;
});

function req(ctx, next) {


    async function aa() {
        console.log('settime_error2');
        setTimeout(() => {
            throw new Error('11221err in timeout');
        }, 10);
        // next();
        // await ttt();
        ctx.body = 1;
    };

    Promise.resolve(async function () {
        try {
            console.log('aa start');
            await aa();
            console.log('aa end');
        }
        catch (err) {
            console.log('catch err,222', err);
        }
    }).then((x)=>{
        console.log(11111222, x);
    }).catch(err=>{
        console.log('aaa, catch', err);
    });
}

router.get('/settime_err22', req);

router.get('/settime_err1', async function (ctx, next) {
    console.log('settime_err1');
    try {
        ctx.body = await new Promise((resolve, reject) => {
            setTimeout(function () {
                console.log('set1');
                // throw new Error('set1 error');
                reject(123);
            }, 1000);
        });    
    } catch (error) {
        ctx.body = {a:1};
        console.log('on catch error');
    }
});

router.get('/settime_err3', async function (ctx, next) {
    console.log('settime_err3');
    ctx.body = await new Promise((resolve, reject) => {
        setTimeout(function () {
            console.log('settime_err3==');
            // throw new Error('set1 error');
            reject(123);
        }, 1000);
    });
});



async function ttt() {
    throw new Error('sss throw sss tttt');
}


module.exports = router;

// process.on('unhandledRejection', (reason, p) => {
//     console.error('Unhandled Rejection at: Promise', p, 'reason:', reason);
//     // logger.error('Unhandled Rejection at: Promise', p, 'reason:', reason);

//     throw reason;
// });
