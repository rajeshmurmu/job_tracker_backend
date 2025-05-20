import vine from "@vinejs/vine";
import { CustomValidationError } from "./customVineErrors.js";

// add custom error reporter or validation error reporter
vine.errorReporter = () => new CustomValidationError();

const registerSchema = vine.object({
  name: vine.string().minLength(3),
  email: vine.string().email(),
  password: vine
    .string()
    .minLength(8)
    .maxLength(32)
    .confirmed("password_confirmation"),
});

const loginSchema = vine.object({
  email: vine.string().email(),
  password: vine.string().minLength(8),
});

const jobSchema = vine.object({
  company_name: vine.string().minLength(3),
  position: vine.string().minLength(3),
  location: vine.string().minLength(3),
  status: vine.enum(["Applied", "Interview", "Rejected", "Offer", "Saved"]),
  applied_date: vine.date(),
  salary: vine.string().optional(),
  job_url: vine.string().optional(),
  notes: vine.string().optional(),
});

export { registerSchema, loginSchema, jobSchema };
