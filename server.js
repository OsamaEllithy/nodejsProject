const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static("public"));

mongoose.connect("mongodb+srv://nodeproject6:o091VYdL0qHjpVkJ@cluster0.e40vhds.mongodb.net/studentDoctorDB?retryWrites=true&w=majority&appName=Cluster0")
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("Connection error", err));

const studentSchema = new mongoose.Schema({
  name: String,
  age: Number,
  level: String,
  address: String
});
const Student = mongoose.model("Student", studentSchema);

const doctorSchema = new mongoose.Schema({
  name: String,
  age: Number,
  phone: String
});
const Doctor = mongoose.model("Doctor", doctorSchema);

// === Endpoints ===
app.post("/student/hardcoded", async (req, res) => {
  const student = new Student({
    name: "Ahmed Ali",
    age: 20,
    level: "Level 2",
    address: "Ismailia"
  });
  await student.save();
  res.send(student);
});

app.post("/student", async (req, res) => {
  const student = new Student(req.body);
  await student.save();
  res.send(student);
});

app.post("/doctor", async (req, res) => {
  const { name, age, phone } = req.query;
  if (!name || !age || !phone) return res.status(400).send({ message: "Missing doctor fields" });
  const doctor = new Doctor({ name, age, phone });
  await doctor.save();
  res.send(doctor);
});

app.get("/students", async (req, res) => {
  const students = await Student.find();
  res.send(students);
});

app.delete("/student/:name", async (req, res) => {
  const result = await Student.findOneAndDelete({ name: req.params.name });
  if (!result) return res.status(404).send({ message: "Student not found" });
  res.send({ message: "Student deleted", result });
});

app.put("/doctor/update-name", async (req, res) => {
  const { oldName, newName } = req.query;
  const doctor = await Doctor.findOne({ name: oldName });
  if (!doctor) return res.status(404).send({ message: "Doctor not found" });
  doctor.name = newName;
  await doctor.save();
  res.send({ message: "Doctor updated", doctor });
});

app.get("/doctors", async (req, res) => {
  const doctors = await Doctor.find();
  res.send(doctors);
});

app.get("/all", async (req, res) => {
  const students = await Student.find();
  const doctors = await Doctor.find();
  res.send({ students, doctors });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});