import { PrismaClient } from '@prisma/client';
import "dotenv/config";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

async function main() {
  const settings = await prisma.setting.findMany();
  console.log("Settings fetched successfully:", settings);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
