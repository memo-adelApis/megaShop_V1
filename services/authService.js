import axiosInstance from "@/context/axiosContext";
import { z } from "zod";



const registerSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function registerUser(name, email, password) {
  // تحقق من صحة البيانات باستخدام zod
  const result = registerSchema.safeParse({ name, email, password });
  if (!result.success) {
    throw new Error(result.error.errors[0].message);
  }

  try {
    const response = await axiosInstance.post('/api/auth/register', {
      name,
      email,
      password
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
}