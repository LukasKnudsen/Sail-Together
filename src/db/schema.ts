import Parse from "@/lib/parse/server";

export async function createSchemas() {
    // Update existing _User schema (cannot create new one)
    const user = new Parse.Schema("_User");
    user.addString("username", { required: true });
    user.addString("email", { required: true });
    user.addString("role", { required: true });
    user.addString("phone");
    user.addString("avatarUrl");
    user.addNumber("rating", { defaultValue: 0 });
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

    const eventSchema = new Parse.Schema("Event");
    eventSchema.addPointer("createdById", "_User", { required: true });
    eventSchema.addPointer("locationId", "Location", { required: true });
    eventSchema.addString("title", { required: true });
    eventSchema.addString("description");
    eventSchema.addBoolean("isFavorite", { defaultValue: false });
    eventSchema.addDate("startDate", { required: true });
    eventSchema.addDate("endDate");
    eventSchema.addString("categorySlug", { required: true, defaultValue: "other" });
    eventSchema.addString("priceKind", { required: true, defaultValue: "free" });
    eventSchema.addNumber("priceAmount");
    eventSchema.addString("priceCurrency", { defaultValue: "DKK" });

    await safeSave(
        new Parse.Schema("Job")
            .addString("title", { required: true })
            .addString("type", { required: true })
            .addDate("date", { required: true })
            .addString("vessel", { required: true })
            .addBoolean("isFavorite", { defaultValue: false })
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