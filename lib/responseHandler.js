function responseHandler() {
    return async (ctx, next) => {
        ctx.json = jsonInfo => {
            ctx.body = jsonInfo
        }

        await next()
    }
}

module.exports = responseHandler