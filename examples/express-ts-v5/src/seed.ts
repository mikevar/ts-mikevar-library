import { db } from "./db";
import * as schema from "./schema";
import { faker } from "@faker-js/faker";

async function main() {
  console.log("Seeding database...");

  await db.transaction(async (tx) => {
    const rolesData = Array.from({ length: 20 }, () => ({
      name: faker.word.noun(),
    }));

    const roles = await tx.insert(schema.roles).values(rolesData).returning();

    if (!roles || roles.length === 0) {
      throw new Error("Failed to create roles");
    }

    const usersData = Array.from({ length: 500 }, () => ({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      passwordHash: faker.internet.password(),
      roleId: roles[Math.floor(Math.random() * roles.length)]!.id,
    }));

    const users = await tx.insert(schema.users).values(usersData).returning();

    if (!users || users.length === 0) {
      throw new Error("Failed to create users");
    }
  });

  // Generate fake users

  process.exit(0);
}

main();
