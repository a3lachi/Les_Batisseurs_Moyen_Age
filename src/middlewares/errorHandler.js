import HttpError from "./HttpError"

export default function errorHandler(err, req, res, next) {
  if (err instanceof HttpError) {
    res.status(err.errorStatus)
    res.send(err.errorMessage)
  } else {
    console.error(err)
    res.status(500)
    res.send("500 - An error occured")
  }
}
