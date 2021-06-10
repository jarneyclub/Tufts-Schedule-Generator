const errorHandler = (res, err, start) => {
    switch (err.code) {
        // 1, when a query/schema is incorrect
        // 2, when a document was not found in the database
        case 1:
        case 2:
            res.status(400);
            res.json({
                err: err.message,
                time_taken: ((Date.now() - start).toString() + "ms")
            });
            break;
        // 4, a backend error.
        case 4:
            res.status(500);
            res.json({
                err: "Something went wrong. Requested service is not available at this time. Please notify the backend.",
                time_taken: ((Date.now() - start).toString() + "ms")
            });
            break;
    }
}

module.exports = errorHandler;