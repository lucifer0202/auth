const request = require("supertest");
const app = require("../server"); // Your Express app

describe("Auth API", () => {
  let token;

  it("should register a new user", async () => {
    const res = await request(app).post("/api/register").send({
      name: "Test User",
      email: "test@example.com",
      password: "testpass123",
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.user.email).toBe("test@example.com");
  });

  it("should login the user and return token", async () => {
    const res = await request(app).post("/api/login").send({
      email: "test@example.com",
      password: "testpass123",
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
  });

  it("should access protected route with valid token", async () => {
    const res = await request(app)
      .get("/api/protected")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/authorized/i);
  });

  it("should reject access with no token", async () => {
    const res = await request(app).get("/api/protected");
    expect(res.statusCode).toBe(401);
  });
});
