import { z } from "zod";

const signInSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(3, { message: "Password must be at least 8 characters" }),
  });

export   type SignInValues = z.infer<typeof signInSchema>;
  export default signInSchema;
  