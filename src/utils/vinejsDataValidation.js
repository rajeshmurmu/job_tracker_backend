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

export { registerSchema, loginSchema };
