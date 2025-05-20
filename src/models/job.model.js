import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    company_name: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Applied", "Interview", "Rejected", "Offer", "Saved"],
      required: true,
    },
    applied_date: {
      type: Date,
      required: true,
    },
    salary: {
      type: String,
      default: "N/A",
    },
    job_url: {
      type: String,
      default: "N/A",
    },
    notes: {
      type: String,
      default: "N/A",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", jobSchema);

export default Job;
