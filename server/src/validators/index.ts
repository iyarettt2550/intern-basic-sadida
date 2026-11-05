import { z } from "zod";

// Helper to check valid Thai phone numbers and reject repetitive spam numbers
const isValidPhone = (val: string): boolean => {
  const clean = val.replace(/[- ]/g, "").trim();
  // Thai mobile (06, 08, 09 -> 10 digits) or landline (02, 03, 04, 05, 07 -> 9 digits)
  if (!/^0[2-9]\d{7,8}$/.test(clean)) return false;

  // Reject all identical digits e.g. 0000000000, 0888888888
  if (/^(\d)\1+$/.test(clean)) return false;

  // Reject simple sequences e.g. 0123456789, 0987654321
  if (clean === "0123456789" || clean === "0987654321" || clean === "0876543210") return false;

  return true;
};

// Helper to check valid email with reputable/realistic domain
const isValidEmail = (val: string): boolean => {
  const email = val.trim().toLowerCase();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) return false;

  const parts = email.split("@");
  if (parts.length !== 2) return false;
  const domain = parts[1];

  // Domain must contain a dot and at least 2 chars for TLD
  const domainParts = domain.split(".");
  if (domainParts.length < 2) return false;
  const tld = domainParts[domainParts.length - 1];
  if (tld.length < 2) return false;

  // Reject common fake domains
  const fakeDomains = ["test.com", "fake.com", "example.com", "asdf.com", "a.com"];
  if (fakeDomains.includes(domain)) return false;

  return true;
};

// Validator for POST /api/contact
export const contactSchema = z.object({
  name: z.string().min(2, "กรุณากรอกชื่อ-นามสกุลอย่างน้อย 2 ตัวอักษร").max(100, "ชื่อยาวเกินไป"),
  email: z
    .string()
    .max(255, "อีเมลยาวเกินไป")
    .refine((val) => isValidEmail(val), {
      message: "กรุณากรอกอีเมลจริงที่ถูกต้อง (เช่น yourname@gmail.com, @hotmail.com)",
    }),
  phone: z
    .string()
    .refine((val) => isValidPhone(val), {
      message: "กรุณากรอกเบอร์โทรศัพท์จริงในประเทศไทย (เช่น 0812345678 หรือ 021234567)",
    }),
  subject: z.string().min(2, "กรุณากรอกหัวข้ออย่างน้อย 2 ตัวอักษร").max(100, "หัวข้อยาวเกินไป"),
  message: z.string().min(5, "กรุณากรอกข้อความอย่างน้อย 5 ตัวอักษร").max(1000, "ข้อความยาวเกินไป"),
});

export type ContactInput = z.infer<typeof contactSchema>;

// Validator for POST /api/auth/login
export const loginSchema = z
  .object({
    username: z.string().optional(),
    userName: z.string().optional(),
    phone: z.string().optional(),
    password: z.string().min(1, "กรุณากรอกรหัสผ่าน"),
  })
  .refine((data) => !!(data.username || data.userName || data.phone), {
    message: "กรุณากรอกชื่อผู้ใช้หรือเบอร์โทรศัพท์",
  });

export type LoginInput = z.infer<typeof loginSchema>;
