const mongoose = require("mongoose");
// const bcrypt = require("bcrypt"); // Uncomment if password hashing is needed

///////////////////// USER SCHEMA /////////////////////
const userSchema = new mongoose.Schema({
  name: { type: String, required: 'Name is required' },
  email: { type: String, required: 'Email is required' },
  password: { type: String, required: 'Password is required' },
  phone: { type: Number, required: 'Phone is required' },
  userType: { type: String, required: 'UserType is required' } // e.g., 'Agent' or 'Ordinary'
}, {
  timestamps: true
});

// Optional: Enable bcrypt password hashing before save
// userSchema.pre("save", async function (next) {
//   try {
//     if (!this.isModified("password")) return next();
//     const hashedPassword = await bcrypt.hash(this.password, 10);
//     this.password = hashedPassword;
//     next();
//   } catch (error) {
//     next(error);
//   }
// });

const UserSchema = mongoose.model("User", userSchema);

///////////////////// COMPLAINT SCHEMA /////////////////////
const complaintSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: Number, required: true },
  comment: { type: String, required: true },
  status: { type: String, required: true } // e.g., 'pending', 'completed'
}, {
  timestamps: true
});

const ComplaintSchema = mongoose.model("Complaint", complaintSchema);

///////////////////// ASSIGNED COMPLAINT SCHEMA /////////////////////
const assignedComplaintSchema = new mongoose.Schema({
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  complaintId: { type: mongoose.Schema.Types.ObjectId, ref: "Complaint", required: true },
  status: { type: String, required: true },
  agentName: { type: String, required: true }
}, {
  timestamps: true
});

const AssignedComplaint = mongoose.model("AssignedComplaint", assignedComplaintSchema);

///////////////////// CHAT / MESSAGE SCHEMA /////////////////////
const messageSchema = new mongoose.Schema({
  name: { type: String, required: 'Name is required' },
  message: { type: String, required: 'Message is required' },
  complaintId: { type: mongoose.Schema.Types.ObjectId, ref: "Complaint", required: true }
}, {
  timestamps: true
});

const MessageSchema = mongoose.model("Message", messageSchema);

///////////////////// EXPORT MODELS /////////////////////
module.exports = {
  UserSchema,
  ComplaintSchema,
  AssignedComplaint,
  MessageSchema
};
