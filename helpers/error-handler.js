 function errorHandler(err, req, res, next) {
    if(err.name === 'UnauthorizedError'){
        return res.status(401).json({
            status: false,
            code: 401,
            data:{err},
            message: "The User is not Authorized ! "
        })
    }
    if(err.name === 'ValidationError'){
        return res.status(401).json({
            status: false,
            code: 401,
            data:{err},
            message: "The User is not Authorized !"
        })
    }

    return res.status(401).json({
        status: false,
        code: 500,
        data:{err},
        message: "The User is not Authorized !"
    })

}