import { createSchemas } from "./schema";

createSchemas()
  .then(() => {
    console.log("✅ Migration completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  });
