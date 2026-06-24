/**
 * One-time demo data seeder.
 *
 * Uses the Firebase ADMIN SDK (not the client SDK used by the app itself)
 * because firestore.rules intentionally blocks client writes to these
 * collections — see README.md. The Admin SDK bypasses security rules,
 * which is exactly what you want for seeding, and exactly what you do NOT
 * want for the running app (hence it isn't used anywhere else in /src).
 *
 * Setup:
 *   1. Firebase Console → Project Settings → Service Accounts →
 *      "Generate new private key" → save as scripts/serviceAccountKey.json
 *      (this file is gitignored — never commit it)
 *   2. npm run seed
 */

const admin = require("firebase-admin");
const path = require("path");

const serviceAccountPath = path.join(__dirname, "serviceAccountKey.json");

let serviceAccount;
try {
  serviceAccount = require(serviceAccountPath);
} catch {
  console.error(
    "\nMissing scripts/serviceAccountKey.json.\n" +
      "Download it from Firebase Console → Project Settings → Service Accounts\n" +
      "→ Generate new private key, then save it at that path.\n"
  );
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

async function seed() {
  const batch = db.batch();

  // --- Products -----------------------------------------------------
  const products = [
    {
      title: "Ragi Detox Mix",
      description:
        "A finger-millet morning blend designed to support digestion and steady energy through the day.",
      category: "Detox Drinks",
      images: [],
      price: 449,
      stockQuantity: 36,
      ingredients: ["Finger millet", "Fenugreek", "Cumin", "Rock salt"],
      benefits: ["Supports digestion", "Rich in calcium", "Naturally gluten-free"],
      nutritionInfo: { calories: 120, protein: 4, carbs: 22, fat: 1.5, fiber: 6 },
      rating: 4.6,
      createdAt: FieldValue.serverTimestamp(),
    },
    {
      title: "Foxtail Millet Breakfast Kit",
      description:
        "A ready-to-cook breakfast kit built around foxtail millet, lightly spiced and pre-portioned.",
      category: "Breakfast Kits",
      images: [],
      price: 599,
      stockQuantity: 22,
      ingredients: ["Foxtail millet", "Moong dal", "Curry leaves", "Mustard seeds"],
      benefits: ["High in fiber", "Low glycemic index", "Ready in 15 minutes"],
      nutritionInfo: { calories: 210, protein: 7, carbs: 38, fat: 3, fiber: 5 },
      rating: 4.8,
      createdAt: FieldValue.serverTimestamp(),
    },
    {
      title: "Cold-Pressed Amla Shot",
      description: "Single-origin amla, cold-pressed within hours of harvest for maximum vitamin C retention.",
      category: "Beverages",
      images: [],
      price: 299,
      stockQuantity: 50,
      ingredients: ["Amla", "Ginger", "Black pepper"],
      benefits: ["Immunity support", "No added sugar", "Antioxidant-rich"],
      nutritionInfo: { calories: 35, protein: 0.5, carbs: 8, fat: 0, fiber: 1 },
      rating: 4.5,
      createdAt: FieldValue.serverTimestamp(),
    },
  ];

  const productRefs = products.map((p) => {
    const ref = db.collection("products").doc();
    batch.set(ref, p);
    return ref;
  });

  // --- Subscription plans --------------------------------------------
  const plans = [
    {
      title: "Gut Reset Weekly",
      weeklyPrice: 1299,
      monthlyPrice: 4499,
      quarterlyPrice: 11999,
      mealsIncluded: 7,
      diseaseType: "Gut Health",
      targetGoal: "Improve digestion and reduce bloating",
      benefits: ["Probiotic-rich meals", "Low FODMAP options", "Weekly check-ins"],
      createdAt: FieldValue.serverTimestamp(),
    },
    {
      title: "Diabetes-Friendly Monthly",
      weeklyPrice: 1599,
      monthlyPrice: 5499,
      quarterlyPrice: 14999,
      mealsIncluded: 30,
      diseaseType: "Diabetes",
      targetGoal: "Stabilize blood sugar with low-GI meals",
      benefits: ["Low glycemic meals", "Dietitian-reviewed", "Free glucose log sheet"],
      createdAt: FieldValue.serverTimestamp(),
    },
  ];
  plans.forEach((p) => batch.set(db.collection("subscriptionPlans").doc(), p));

  // --- Testimonials ----------------------------------------------------
  const testimonials = [
    {
      userName: "Anjali R.",
      message: "Switching to the Ragi Detox Mix changed my mornings — calmer energy, no crashes by 11am.",
      rating: 5,
      image: "",
      createdAt: FieldValue.serverTimestamp(),
    },
    {
      userName: "Karthik M.",
      message: "The Gut Reset plan is the first subscription I've actually finished without giving up.",
      rating: 5,
      image: "",
      createdAt: FieldValue.serverTimestamp(),
    },
  ];
  testimonials.forEach((t) => batch.set(db.collection("testimonials").doc(), t));

  // --- Blogs -----------------------------------------------------------
  const blogs = [
    {
      title: "5 Millets You Should Be Eating This Season",
      content:
        "Millets have quietly been the backbone of Indian kitchens for centuries. Here's a practical guide to five you can start with this week, what they pair well with, and how to cook them without overthinking it.",
      imageUrl: "",
      category: "Nutrition",
      createdAt: FieldValue.serverTimestamp(),
    },
  ];
  blogs.forEach((b) => batch.set(db.collection("blogs").doc(), b));

  // --- A demo user ------------------------------------------------------
  const userRef = db.collection("users").doc("demo-user-1");
  batch.set(userRef, {
    uid: "demo-user-1",
    fullName: "Demo Customer",
    email: "demo@hitham.in",
    phone: "+91 90000 00000",
    age: 29,
    gender: "Female",
    weight: 64,
    height: 165,
    diseaseType: "Gut Health",
    healthGoal: "Improve digestion",
    activeSubscription: true,
    role: "customer",
    createdAt: FieldValue.serverTimestamp(),
  });

  await batch.commit();

  // --- A demo order (separate write so we can reference the product ids) ---
  await db.collection("orders").add({
    userId: "demo-user-1",
    userEmail: "demo@hitham.in",
    userName: "Demo Customer",
    items: [
      {
        productId: productRefs[0].id,
        title: products[0].title,
        price: products[0].price,
        quantity: 2,
      },
      {
        productId: productRefs[1].id,
        title: products[1].title,
        price: products[1].price,
        quantity: 1,
      },
    ],
    totalAmount: products[0].price * 2 + products[1].price,
    paymentStatus: "Paid",
    orderStatus: "Delivered",
    shippingAddress: "12 Jubilee Hills, Hyderabad, Telangana 500033",
    createdAt: FieldValue.serverTimestamp(),
  });

  console.log("✅ Seed complete: products, plans, testimonials, blogs, a demo user, and one order.");
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  });
