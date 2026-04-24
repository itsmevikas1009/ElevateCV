import bcrypt from "bcrypt";
import User from "../models/User.js";

/**
 * Seeds the admin user on server startup if not already present.
 * Uses credentials from .env: ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME
 */
export async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || "Admin";

  if (!email || !password) {
    console.log("⚠️  No ADMIN_EMAIL/ADMIN_PASSWORD in .env — skipping admin seed.");
    return;
  }

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      // Ensure role is admin
      if (existing.role !== "admin") {
        existing.role = "admin";
        await existing.save();
        console.log(`✅ Updated ${email} role to admin`);
      }
      return;
    }

    const hashed = await bcrypt.hash(password, 10);
    await User.create({
      name,
      email,
      password: hashed,
      role: "admin",
    });
    console.log(`✅ Admin user created: ${email}`);
  } catch (err) {
    console.error("❌ Admin seed error:", err.message);
  }
}
