const mongoose = require("mongoose");

mongoose.set('strictQuery', true); // Optional for newer versions

mongoose.connect("mongodb://127.0.0.1:27017/details", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log("✅ Connected to MongoDB");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
