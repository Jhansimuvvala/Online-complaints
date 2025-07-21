const express = require("express");
const cors = require("cors");
require("./config");
const {
  ComplaintSchema,
  UserSchema,
  AssignedComplaint,
  MessageSchema,
} = require("./Schema");

const app = express();
const PORT = 8000;

app.use(express.json());
app.use(cors());

/*********************** MESSAGES *******************************/
app.post("/messages", async (req, res) => {
  try {
    const { name, message, complaintId } = req.body;
    const messageData = new MessageSchema({ name, message, complaintId });
    const messageSaved = await messageData.save();
    res.status(200).json(messageSaved);
  } catch (err) {
    res.status(500).json({ error: "Failed to send message" });
  }
});

app.get("/messages/:complaintId", async (req, res) => {
  try {
    const { complaintId } = req.params;
    const messages = await MessageSchema.find({ complaintId }).sort("-createdAt");
    res.json(messages);
  } catch {
    res.status(500).json({ error: "Failed to retrieve messages" });
  }
});

/*********************** AUTH ***********************************/
app.post("/SignUp", async (req, res) => {
  try {
    const user = new UserSchema(req.body);
    const resultUser = await user.save();
    res.send(resultUser);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post("/Login", async (req, res) => {
  const { email, password } = req.body;
  const user = await UserSchema.findOne({ email });
  if (!user) return res.status(401).json({ message: "User doesn’t exist" });

  if (user.password === password) {
    res.json(user);
  } else {
    res.status(401).json({ message: "Invalid Credentials" });
  }
});

/*********************** USERS **********************************/
app.get("/AgentUsers", async (_, res) => {
  try {
    const agents = await UserSchema.find({ userType: "Agent" });
    res.status(agents.length ? 200 : 404).json(agents);
  } catch {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/AgentUsers/:agentId", async (req, res) => {
  try {
    const user = await UserSchema.findById(req.params.agentId);
    if (user?.userType === "Agent") {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/OrdinaryUsers", async (_, res) => {
  try {
    const users = await UserSchema.find({ userType: "Ordinary" });
    res.status(users.length ? 200 : 404).json(users);
  } catch {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/OrdinaryUsers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserSchema.findById(id);
    if (!user) return res.status(404).json({ error: "User not found" });

    await UserSchema.deleteOne({ _id: id });
    await ComplaintSchema.deleteMany({ userId: id });
    res.status(200).json({ message: "User deleted successfully" });
  } catch {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/*********************** COMPLAINTS ******************************/
app.post("/Complaint/:id", async (req, res) => {
  try {
    const user = await UserSchema.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const complaint = new ComplaintSchema(req.body);
    const savedComplaint = await complaint.save();
    res.status(200).json(savedComplaint);
  } catch {
    res.status(500).json({ error: "Failed to register complaint" });
  }
});

app.get("/status/:id", async (req, res) => {
  try {
    const user = await UserSchema.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const complaints = await ComplaintSchema.find({ userId: user._id });
    res.json(complaints);
  } catch {
    res.status(500).json({ error: "Failed to retrieve complaints" });
  }
});

app.get("/status", async (_, res) => {
  try {
    const complaints = await ComplaintSchema.find();
    res.json(complaints);
  } catch {
    res.status(500).json({ error: "Failed to retrieve Complaints" });
  }
});

/********************* ASSIGNED COMPLAINTS ***********************/
app.post("/assignedComplaints", async (req, res) => {
  try {
    const assignedComplaint = new AssignedComplaint(req.body);
    await assignedComplaint.save();
    res.sendStatus(201);
  } catch {
    res.status(500).json({ error: "Failed to add assigned complaint" });
  }
});

app.get("/allcomplaints/:agentId", async (req, res) => {
  try {
    const complaints = await AssignedComplaint.find({ agentId: req.params.agentId });

    const complaintIds = complaints.map((c) => c.complaintId);
    const details = await ComplaintSchema.find({ _id: { $in: complaintIds } });

    const merged = complaints.map((assigned) => {
      const match = details.find((d) => d._id.toString() === assigned.complaintId.toString());
      return {
        ...assigned.toObject(),
        name: match?.name ?? "",
        city: match?.city ?? "",
        state: match?.state ?? "",
        address: match?.address ?? "",
        pincode: match?.pincode ?? "",
        comment: match?.comment ?? "",
        _doc: {
          complaintId: assigned.complaintId,
          status: match?.status ?? assigned.status
        }
      };
    });

    res.json(merged);
  } catch (error) {
    console.error("Error in /allcomplaints/:agentId", error);
    res.status(500).json({ error: "Failed to get complaints" });
  }
});

/********************* UPDATES ******************************/
app.put("/user/:_id", async (req, res) => {
  try {
    const updated = await UserSchema.findByIdAndUpdate(
      req.params._id,
      req.body,
      { new: true }
    );
    res.status(updated ? 200 : 404).json(updated || { error: "User not found" });
  } catch {
    res.status(500).json({ error: "Failed to update the user" });
  }
});

app.put("/complaint/:complaintId", async (req, res) => {
  try {
    const { complaintId } = req.params;
    const { status } = req.body;
    if (!complaintId || !status)
      return res.status(400).json({ error: "Missing complaintId or status" });

    const updated = await ComplaintSchema.findByIdAndUpdate(
      complaintId,
      { status },
      { new: true }
    );
    await AssignedComplaint.findOneAndUpdate({ complaintId }, { status });

    res.status(updated ? 200 : 404).json(updated || { error: "Complaint not found" });
  } catch {
    res.status(500).json({ error: "Failed to update complaint" });
  }
});

/********************* START SERVER ******************************/
app.listen(PORT, () => console.log(`🚀 Server started at http://localhost:${PORT}`));
