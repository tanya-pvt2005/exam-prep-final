import { jest } from "@jest/globals";
import { register } from "../../controllers/authController.js";

test("register → missing fields → 400", async () => {
  const req = {
    body: { email: "test@test.com" } // name & password missing
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };

  await register(req, res);

  expect(res.status).toHaveBeenCalledWith(400);
});
