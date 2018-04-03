let isProduction = process.env.NODE_ENV === 'production';

function customError(err) {
    if (err.status == 404) {
        return {
            'hello': 'world'
        };
    }

    return {
        isSuccess: false,
        code: '500',
        message: isProduction ? 'Unexpected' : err.message
    }
}

module.exports = customError;