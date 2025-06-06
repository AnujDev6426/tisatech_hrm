module.exports = fn => (req, res, next) => {
    fn(req, res, next).catch((err) => {
        res.status(200).json({ 
            status:false,
            message: err?.message || 'Something went wrong.' 
        });
    });
}
