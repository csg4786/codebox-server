// Error: 400

const badRequest = (req, res, next) => {
    const error = new Error(`Bad Request : ${req.originalUrl}`);
    res.status(400);
    next(error);
};

// Error: 404

const notFound = (req, res, next) => {
    const error = new Error(`Not Found : ${req.originalUrl}`);
    res.status(404);
    next(error);
};

const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        status: "failure",
        message: err?.message,
        stack: err?.stack,
    });
}

module.exports = {notFound, badRequest, errorHandler};