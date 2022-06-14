export default function errorsMiddleware(err, req, res, next) {
  // console.error("Error: \n" + err);
  res.status(500).send({ success: false, message: err.errors[0].message });
}
