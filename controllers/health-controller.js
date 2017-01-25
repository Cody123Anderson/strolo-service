exports.healthCheck = (req, res, next) => {
  res.status(200).send({
    status: 200,
    health: 'I\'m alive and well, thanks for checking on me!'
  });
};
