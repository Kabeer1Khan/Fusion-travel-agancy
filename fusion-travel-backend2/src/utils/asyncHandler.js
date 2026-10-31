// async function में error आए तो अपने-आप error handler तक पहुँचा दो (हर जगह try/catch नहीं लिखना पड़ता)
module.exports = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
