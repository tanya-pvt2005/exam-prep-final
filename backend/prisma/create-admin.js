import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function createAdmin() {
  const email = "admin@example.com";
  const password = "Admin@123";

  const hashed = await bcrypt.hash(password, 10);

  const admin = await prisma.user.create({
    data: {
      name: "Super Admin",
      email,
      password: hashed,
      role: "admin"
    }
  });

  console.log("Admin created:", admin);
  console.log("Login Email:", email);
  console.log("Password:", password);

  await prisma.$disconnect();
}

createAdmin().catch((e) => {
  console.error(e);
  prisma.$disconnect();
});
