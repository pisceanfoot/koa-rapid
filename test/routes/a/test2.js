const KoaEmbed = require('../../../');

let router = KoaEmbed.router();

router.get('/hello2', async function (ctx, next) {
    ctx.body = {"hello2": 'x'};
});


module.exports = router;
