let isProduction = process.env.NODE_ENV === 'production'

module.exports = function customError(options) {
    options = options || {}

    async function jsonError(ctx, err) {
        let previewStatus = ctx.status

        if (ctx.status == 404) {
            ctx.body = {
                'hello': 'unknown world'
            }

            ctx.status = previewStatus
        }else if(ctx.status >= 500){
            ctx.body = {
                isSuccess: false,
                code: '500',
                message: isProduction ? 'Unexpected error' : err.message
            }

            ctx.status = previewStatus
        }
    }
    
    async function htmlError(ctx, err) {
        if(ctx.render){
            let previewStatus = ctx.status

            if (ctx.status == 404) {
                if(options.view_404){
                    await ctx.render(options.view_404, options.custom ? options.custom(err) : err)
                    ctx.status = previewStatus
                }
            }else if(ctx.status >= 500){
                if(options.view_500){
                    await ctx.render(options.view_500, options.custom ? options.custom(err) : err)
                    ctx.status = previewStatus
                }
            }
        }

        // TODO: set default error when no render method
    }

    const handleError = async (ctx, err) => {
        if(!ctx.status){
            ctx.status = 404
        }else if(ctx.status == 200 &&
            !ctx.body){
            ctx.status = 404
        }

        if (ctx.status == 404 || ctx.status >= 500) {
            let contentType = ctx.headers['content-type']
            let xhr = ctx.headers['x-requested-with'] === 'XMLHttpRequest'

            if(xhr || (contentType && contentType.indexOf('application/json') == 0)){
                await jsonError(ctx, err)
            }else{
                await htmlError(ctx, err)
            }
        }
    }

    const shouldEmitError = (status) => {
        return status >= 500
    }

    return async function (ctx, next) {
        try{
            await next()

            await handleError(ctx)
        }catch(err){
            ctx.status = err.status || err.statusCode || 500

            await handleError(ctx, err)
            shouldEmitError(ctx.status) && ctx.app.emit('error', err, ctx)
        }
    }
}