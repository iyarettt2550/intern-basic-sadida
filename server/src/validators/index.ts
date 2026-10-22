import { z } from "zod";

// Validator for POST /api/contact
export const contactSchema = z.object({
  name: z.string().min(1, "กรุณากรอกชื่อ").max(100, "ชื่อยาวเกินไป"),
  email: z.string().email("รูปแบบอีเมลไม่ถูกต้อง").max(25, "อีเมลยาวเกินไป"),
  phone: z
    .string()
    .regex(/^[0-9]{9,10}$/, "เบอร์โทรศัพท์ต้องเป็นตัวเลข 9-10 หลัก"),
  subject: z.string().min(1, "กรุณากรอกหัวข้อ").max(50, "หัวข้อยาวเกินไป"),
  message: z.string().min(1, "กรุณากรอกข้อความ").max(200, "ข้อความยาวเกินไป"),
});

export type ContactInput = z.infer<typeof contactSchema>;
