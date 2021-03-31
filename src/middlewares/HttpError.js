class HttpError extends Error {
  constructor(errorStatus, errorMessage) {
    super(`${errorStatus} - ${errorMessage}`)
    this.errorStatus = errorStatus
    this.errorMessage = errorMessage
  }
}

export default HttpError
