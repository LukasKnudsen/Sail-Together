import Parse from "@/lib/parse/server";

export async function createSchemas() {
  // Update existing _User schema (cannot create new one)
  const user = new Parse.Schema("_User");
  user.addString("role");
  user.addString("phone");
  user.addString("avatarUrl");
  user.addNumber("rating");
  user.addDate("joinedDate");
  user.addString("location");
  user.addString("about");
  user.addArray("skills");
  try {
    await user.update();
    console.log("✅ Updated _User schema");
  } catch (err: any) {
    console.log("⚠️ _User update skipped:", err.message);
  }

  // helper for idempotent schema creation
  async function safeSave(schema: any, name: string) {
    try {
      await schema.save();
      console.log(`✅ Created schema: ${name}`);
    } catch (err: any) {
      if (err.code === 103) {
        console.log(`⚠️ Schema ${name} already exists, skipping.`);
      } else {
        throw err;
      }
    }
  }

  await safeSave(
    new Parse.Schema("Location")
      .addString("name", { required: true })
      .addString("address", { required: true })
      .addNumber("longitude", { required: true })
      .addNumber("latitude", { required: true }),
    "Location"
  );

  // Create Event schema with all fields
  // Note: If Event table exists with only default fields, delete it in Back4App first
  // Parse Server's update() doesn't add all fields at once to existing schemas
  const eventSchema = new Parse.Schema("Event");
  eventSchema.addString("title", { required: true });
  eventSchema.addString("description");
  eventSchema.addBoolean("isFavorite");
  eventSchema.addDate("startDate", { required: true });
  eventSchema.addDate("endDate");
  eventSchema.addString("categorySlug", { required: true });
  eventSchema.addPointer("locationId", "Location", { required: true });
  eventSchema.addPointer("createdById", "_User");
  eventSchema.addString("priceKind", { required: true });
  eventSchema.addNumber("priceAmount");
  eventSchema.addString("priceCurrency");

  try {
    await eventSchema.save();
    console.log("✅ Created Event schema with all fields");
  } catch (err: any) {
    if (err.code === 103) {
      console.log("⚠️ Event schema already exists.");
      console.log(
        "⚠️ If it only has default fields, delete it in Back4App dashboard and run migration again."
      );
      console.log("⚠️ Or manually add fields one by one using update()");

      // Try to update with all fields (may not work if schema is empty)
      try {
        await eventSchema.update();
        console.log("✅ Updated Event schema");
      } catch (updateErr: any) {
        console.log("❌ Update failed:", updateErr.message);
        console.log("💡 Solution: Delete Event table in Back4App, then run migration again");
      }
    } else {
      throw err;
    }
  }

  await safeSave(
    new Parse.Schema("Job")
      .addString("title", { required: true })
      .addString("type", { required: true })
      .addDate("date", { required: true })
      .addString("vessel", { required: true })
      .addBoolean("isFavorite")
      .addPointer("locationId", "Location", { required: true })
      .addPointer("createdById", "_User")
      .addString("description", { required: true }),
    "Job"
  );

  await safeSave(
    new Parse.Schema("JobRequirement")
      .addPointer("jobId", "Job", { required: true })
      .addString("requirement", { required: true })
      .addNumber("order", { required: true }),
    "JobRequirement"
  );

  await safeSave(
    new Parse.Schema("JobExperience")
      .addPointer("jobId", "Job", { required: true })
      .addString("experience", { required: true })
      .addNumber("order", { required: true }),
    "JobExperience"
  );

  await safeSave(
    new Parse.Schema("JobQualification")
      .addPointer("jobId", "Job", { required: true })
      .addString("qualification", { required: true })
      .addNumber("order", { required: true }),
    "JobQualification"
  );

  await safeSave(
    new Parse.Schema("Post")
      .addPointer("userId", "_User", { required: true })
      .addString("mediaUrl", { required: true })
      .addString("mediaAlt")
      .addPointer("locationId", "Location")
      .addNumber("likeCount", { defaultValue: 0 })
      .addNumber("commentCount", { defaultValue: 0 }),
    "Post"
  );

  await safeSave(
    new Parse.Schema("PostLike")
      .addPointer("postId", "Post", { required: true })
      .addPointer("userId", "_User", { required: true }),
    "PostLike"
  );

  await safeSave(
    new Parse.Schema("Comment")
      .addPointer("postId", "Post", { required: true })
      .addPointer("userId", "_User", { required: true })
      .addString("text", { required: true }),
    "Comment"
  );

  await safeSave(
    new Parse.Schema("Experience")
      .addPointer("userId", "_User", { required: true })
      .addString("title", { required: true })
      .addString("location", { required: true })
      .addString("vessel", { required: true })
      .addDate("date", { required: true }),
    "Experience"
  );

  await safeSave(
    new Parse.Schema("Qualification")
      .addPointer("userId", "_User", { required: true })
      .addString("name", { required: true }),
    "Qualification"
  );

  await safeSave(
    new Parse.Schema("Feedback")
      .addPointer("userId", "_User", { required: true })
      .addPointer("authorId", "_User", { required: true })
      .addString("comment", { required: true }),
    "Feedback"
  );

  console.log("✅ All schemas processed successfully!");
}

createSchemas()
  .then(() => {
    console.log("✅ Migration completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  });
