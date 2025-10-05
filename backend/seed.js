// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import Course from "./models/Course.js";
// import User from "./models/User.js";

// dotenv.config();

// const MONGO_URI = process.env.MONGO_URI;

// const coursesData = [
//   {
//     title: "Learn Python Programming",
//     description: "Complete Python course from basics to advanced with real projects.",
//     published: true
//   },
//   {
//     title: "Web Development with React",
//     description: "Build modern web applications using React.js, Redux, and Hooks.",
//     published: true
//   },
//   {
//     title: "Full Stack Development with MERN",
//     description: "Learn MongoDB, Express, React, and Node.js to build full-stack apps.",
//     published: true
//   },
//   {
//     title: "Data Structures & Algorithms",
//     description: "Master DSA in Java and Python for interviews and competitive exams.",
//     published: true
//   },
//   {
//     title: "Artificial Intelligence & Machine Learning",
//     description: "Hands-on AI & ML course with Python, TensorFlow, and real datasets.",
//     published: true
//   },
//   {
//     title: "Digital Marketing Mastery",
//     description: "Learn SEO, SEM, social media marketing, and content strategy.",
//     published: true
//   },
//   {
//     title: "UI/UX Design Essentials",
//     description: "Learn wireframing, prototyping, and user experience best practices.",
//     published: true
//   },
//   {
//     title: "Blockchain Development",
//     description: "Build decentralized applications using Ethereum and Solidity.",
//     published: false
//   },
//   {
//     title: "Android App Development",
//     description: "Create Android apps with Kotlin and Android Studio.",
//     published: true
//   },
//   {
//     title: "Competitive Programming (Indian Olympiad Style)",
//     description: "Prepare for coding competitions and olympiads with Java and C++.",
//     published: true
//   }
// ];

// async function seedCourses() {
//   try {
//     await mongoose.connect(MONGO_URI);
//     console.log("MongoDB connected");

//     const users = await User.find({}); // get all users
//     if (users.length === 0) {
//       console.log("No users found! Seed users first.");
//       process.exit(1);
//     }

//     const coursesToInsert = coursesData.map((course) => {
//       const randomUser = users[Math.floor(Math.random() * users.length)];
//       return {
//         ...course,
//         creatorId: randomUser._id,
//         publishedAt: course.published ? new Date() : null,
//         lessonsCount: Math.floor(Math.random() * 10) + 1
//       };
//     });

//     await Course.insertMany(coursesToInsert);
//     console.log("✅ Courses seeded successfully!");
//     process.exit(0);
//   } catch (err) {
//     console.error(err);
//     process.exit(1);
//   }
// }

// seedCourses();

// import mongoose from "mongoose";
// import Lesson from "./models/Lesson.js"; // adjust the path as needed
// import dotenv from "dotenv";
// dotenv.config();

// // MongoDB connection (Mongoose)
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => console.log("✅ MongoDB connected for seeding"))
// .catch((err) => console.error("❌ Connection error:", err));

// // Seed lessons for 3 existing courses
// const lessons = [
//   // --- Python Course ---
//   {
//     courseId: "68e189e0333e781458bb9678",
//     title: "Introduction to Python",
//     description: "Understand Python basics, syntax, and setup environment.",
//     videoUrl: "https://example.com/python-intro.mp4",
//     order: 1,
//     transcript: [
//       { start: 0, end: 10, text: "Welcome to Python programming." },
//       { start: 10, end: 25, text: "In this lesson, we’ll learn about syntax." }
//     ]
//   },
//   {
//     courseId: "68e189e0333e781458bb9678",
//     title: "Data Types and Variables",
//     description: "Learn Python data types, variables, and operators.",
//     videoUrl: "https://example.com/python-datatypes.mp4",
//     order: 2,
//     transcript: [
//       { start: 0, end: 15, text: "Let’s explore data types in Python." },
//       { start: 15, end: 30, text: "We'll discuss integers, strings, and lists." }
//     ]
//   },

//   // --- React Course ---
//   {
//     courseId: "68e189e0333e781458bb9679",
//     title: "React Basics",
//     description: "Introduction to components, JSX, and props.",
//     videoUrl: "https://example.com/react-basics.mp4",
//     order: 1,
//     transcript: [
//       { start: 0, end: 10, text: "Welcome to React course." },
//       { start: 10, end: 20, text: "This lesson covers components and JSX." }
//     ]
//   },
//   {
//     courseId: "68e189e0333e781458bb9679",
//     title: "React Hooks Overview",
//     description: "Understanding useState and useEffect.",
//     videoUrl: "https://example.com/react-hooks.mp4",
//     order: 2,
//     transcript: [
//       { start: 0, end: 10, text: "Let’s discuss React hooks." },
//       { start: 10, end: 20, text: "We’ll start with useState and useEffect." }
//     ]
//   },

//   // --- MERN Course ---
//   {
//     courseId: "68e189e0333e781458bb967a",
//     title: "Building a MERN App",
//     description: "Setup MongoDB, Express, React, and Node.js project.",
//     videoUrl: "https://example.com/mern-setup.mp4",
//     order: 1,
//     transcript: [
//       { start: 0, end: 10, text: "Welcome to MERN stack course." },
//       { start: 10, end: 20, text: "We’ll build a full stack app." }
//     ]
//   },
//   {
//     courseId: "68e189e0333e781458bb967a",
//     title: "Connecting Frontend and Backend",
//     description: "Learn to integrate React frontend with Node backend.",
//     videoUrl: "https://example.com/mern-connect.mp4",
//     order: 2,
//     transcript: [
//       { start: 0, end: 10, text: "In this lesson, we connect frontend and backend." },
//       { start: 10, end: 20, text: "We’ll use Axios for API calls." }
//     ]
//   }
// ];

// // Insert function
// const seedLessons = async () => {
//   try {
//     await Lesson.deleteMany(); // optional - clear old data
//     const inserted = await Lesson.insertMany(lessons);
//     console.log(`✅ Inserted ${inserted.length} lessons successfully`);
//   } catch (err) {
//     console.error("❌ Seeding error:", err);
//   } finally {
//     mongoose.connection.close();
//   }
// };

// seedLessons();



import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    // Connect to MongoDB
 // MongoDB connection (Mongoose)
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected for seeding"))
.catch((err) => console.error("❌ Connection error:", err));

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: "admin@skillion.com" });
    if (existingAdmin) {
      console.log("⚠️ Admin already exists!");
      mongoose.connection.close();
      return;
    }

    // Hash password
    const password = "Admin@123";
    const passwordHash = await bcrypt.hash(password, 10);

    // Create admin user
    const admin = new User({
      name: "Super Admin",
      email: "admin@exp.com",
      passwordHash,
      role: "Admin",
      emailVerified: true,
    });

    await admin.save();
    console.log("✅ Admin user created successfully:");
    console.log("Email:", admin.email);
    console.log("Password:", password);

    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error seeding admin:", error);
    mongoose.connection.close();
  }
};

seedAdmin();

