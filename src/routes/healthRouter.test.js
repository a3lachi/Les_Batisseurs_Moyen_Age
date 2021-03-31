import request from "supertest"
import app from "../app"

describe("Test the health check", () => {
  test("It should response the GET method", async () => {
    const response = await request(app).get("/health")
    expect(response.statusCode).toBe(200)
    expect(response.body).toStrictEqual({ health: "ok" })
  })
})
