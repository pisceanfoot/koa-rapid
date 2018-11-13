const KoaRapid = require('../../../');

let router = KoaRapid.router();

router.get('/hello2', async function (ctx, next) {
    ctx.body = {"hello2": 'x'};
});


module.exports = router;
