module.exports = (err, _req, res, _next) => {
  console.error(err);
  const status = err.statusCode || 500;
  res.status(status).json({
    error: status === 500 ? 'Erro interno do servidor' : err.message
  });
};
