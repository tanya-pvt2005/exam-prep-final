// tests/unit/auth.test.js
import { jest } from "@jest/globals";
import { register } from "../../controllers/authController.js";
import { PrismaClient } from "@prisma/client";

// Mock PrismaClient
jest.mock("@prisma/client", () => {
  return {
    PrismaClient: jest.fn(() => ({
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
    })),
  };
});

describe("Auth Controller - Register", () => {

  test("missing fields → 400", async () => {
    const req = { body: { email: "test@test.com" } }; // name/password missing
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await register(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("email exists → 409", async () => {
    const req = { body: { email: "test@test.com", password: "1234" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    // Mock findUnique to return existing user
    PrismaClient.mockImplementation(() => ({
      user: { findUnique: jest.fn().mockResolvedValue({ id: 1, email: "test@test.com" }) },
    }));

    await register(req, res);
    expect(res.status).toHaveBeenCalledWith(409);
  });

});
