import { z } from "zod";

const signUpSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(3, { message: "Password must be at least 8 characters" }),
  });

 export  type SignUpValues = z.infer<typeof signUpSchema>;
  export default signUpSchema;