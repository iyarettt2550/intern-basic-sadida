import { z } from "zod";

// Helper to check valid Thai phone numbers and reject fake/spam numbers
export const validatePhone = (raw: string): { valid: boolean; message: string } => {
  const clean = raw.replace(/[- ]/g, "").trim();

  if (!clean) {
    return { valid: false, message: "กรุณากรอกเบอร์โทรศัพท์" };
  }

  // 1. Must contain only numbers
  if (!/^\d+$/.test(clean)) {
    return { valid: false, message: "เบอร์โทรศัพท์ต้องเป็นตัวเลขเท่านั้น (ห้ามใส่อักษรหรืออักขระพิเศษ)" };
  }

  // 2. Must start with 0
  if (!clean.startsWith("0")) {
    return { valid: false, message: "เบอร์โทรศัพท์ในประเทศไทยต้องขึ้นต้นด้วยเลข 0 เสมอ" };
  }

  // 3. Length must be exactly 9 (landline) or 10 (mobile) digits
  if (clean.length !== 9 && clean.length !== 10) {
    return { valid: false, message: "เบอร์โทรศัพท์ต้องมี 10 หลัก (เบอร์มือถือ) หรือ 9 หลัก (เบอร์บ้าน)" };
  }

  // 4. Strict Thai prefix check:
  // - Mobile (10 digits): MUST start with 06, 08, 09
  // - Landline (9 digits): MUST start with 02 (BKK) or 03, 04, 05, 07 (Provincial)
  const isMobile = clean.length === 10 && /^0[689]\d{8}$/.test(clean);
  const isLandline = clean.length === 9 && /^0[23457]\d{7}$/.test(clean);

  if (!isMobile && !isLandline) {
    if (clean.length === 10) {
      return {
        valid: false,
        message: "เบอร์มือถือ 10 หลักต้องขึ้นต้นด้วย 06, 08 หรือ 09 เท่านั้น (เบอร์บ้านมี 9 หลัก)",
      };
    } else {
      return {
        valid: false,
        message: "เบอร์บ้าน 9 หลักต้องขึ้นต้นด้วย 02 หรือ 03, 04, 05, 07",
      };
    }
  }

  // 5. Reject repeated digits e.g. 0999999999, 0888888888, 0000000000
  if (/^0(\d)\1+$/.test(clean)) {
    return { valid: false, message: "ไม่อนุญาตให้ใช้เบอร์ที่เป็นเลขซ้ำกันทั้งหมด" };
  }

  // 6. Reject 6 or more identical consecutive digits
  if (/(\d)\1{5,}/.test(clean)) {
    return { valid: false, message: "เบอร์โทรศัพท์มีตัวเลขซ้ำกันผิดปกติ กรุณากรอกเบอร์จริง" };
  }

  // 7. Reject simple sequences
  const sequences = ["0123456789", "0987654321", "0876543210", "0898765432", "0678901234"];
  if (sequences.includes(clean)) {
    return { valid: false, message: "ไม่อนุญาตให้ใช้ตัวเลขเรียงลำดับ" };
  }

  return { valid: true, message: "" };
};

// Helper to check valid email with reputable/realistic domain
export const validateEmail = (raw: string): { valid: boolean; message: string } => {
  const email = raw.trim().toLowerCase();

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,10}$/;
  if (!emailRegex.test(email)) {
    return { valid: false, message: "รูปแบบอีเมลไม่ถูกต้อง (ตัวอย่าง: yourname@gmail.com)" };
  }

  const parts = email.split("@");
  if (parts.length !== 2) {
    return { valid: false, message: "รูปแบบอีเมลไม่ถูกต้อง" };
  }

  const [username, domain] = parts;

  if (username.length < 2) {
    return { valid: false, message: "ชื่ออีเมลต้องมีอย่างน้อย 2 ตัวอักษร" };
  }

  const domainParts = domain.split(".");
  if (domainParts.length < 2) {
    return { valid: false, message: "โดเมนอีเมลต้องมีนามสกุล (เช่น .com หรือ .co.th)" };
  }

  const tld = domainParts[domainParts.length - 1];
  // TLD must be at least 2 characters and letters only (e.g. .com, .net, .co.th)
  if (tld.length < 2 || !/^[a-z]+$/.test(tld)) {
    return { valid: false, message: "นามสกุลโดเมนอีเมลไม่ถูกต้อง (ต้องมีอย่างน้อย 2 ตัวอักษร เช่น .com, .co.th)" };
  }

  const mainDomain = domainParts[0];
  if (mainDomain.length < 2) {
    return { valid: false, message: "ชื่อโดเมนอีเมลสั้นผิดปกติหรือไม่ถูกต้อง" };
  }

  // Reject known fake/troll/disposable domains
  const blockedDomains = [
    "test.com",
    "fake.com",
    "example.com",
    "asdf.com",
    "a.com",
    "hot.dog",
    "good.com",
    "htc.com",
    "temp.com",
    "trash.com",
    "mailinator.com",
    "10minutemail.com",
    "guerrillamail.com",
    "yopmail.com",
    "dispostable.com",
    "throwaway.com",
  ];

  if (blockedDomains.includes(domain)) {
    return { valid: false, message: `ไม่อนุญาตให้อีเมลจากโดเมน @${domain} กรุณาใช้อีเมลจริง` };
  }

  return { valid: true, message: "" };
};

export const validateName = (raw: string): { valid: boolean; message: string } => {
  const name = raw.trim();
  if (name.length < 2) {
    return { valid: false, message: "กรุณากรอกชื่อ-นามสกุลอย่างน้อย 2 ตัวอักษร" };
  }
  if (name.length > 100) {
    return { valid: false, message: "ชื่อ-นามสกุลยาวเกินไป (ไม่เกิน 100 ตัวอักษร)" };
  }
  if (/(.)\1{4,}/.test(name)) {
    return { valid: false, message: "กรุณากรอกชื่อจริง ไม่ใช้อักษรซ้ำกันแบบสแปม" };
  }
  return { valid: true, message: "" };
};

export const validateSubject = (raw: string): { valid: boolean; message: string } => {
  const subject = raw.trim();
  if (subject.length < 2) {
    return { valid: false, message: "กรุณากรอกหัวข้ออย่างน้อย 2 ตัวอักษร" };
  }
  if (subject.length > 100) {
    return { valid: false, message: "หัวข้อยาวเกินไป (ไม่เกิน 100 ตัวอักษร)" };
  }
  if (/(.)\1{4,}/.test(subject)) {
    return { valid: false, message: "หัวข้อมีอักขระซ้ำกันผิดปกติ" };
  }
  return { valid: true, message: "" };
};

export const validateMessage = (raw: string): { valid: boolean; message: string } => {
  const message = raw.trim();
  if (message.length < 5) {
    return { valid: false, message: "กรุณากรอกข้อความอย่างน้อย 5 ตัวอักษร" };
  }
  if (message.length > 1000) {
    return { valid: false, message: "ข้อความยาวเกินไป (ไม่เกิน 1000 ตัวอักษร)" };
  }
  if (/(.)\1{6,}/.test(message)) {
    return { valid: false, message: "ข้อความมีอักขระซ้ำกันผิดปกติ" };
  }
  return { valid: true, message: "" };
};

// Validator for POST /api/contact
export const contactSchema = z.object({
  name: z.string().superRefine((val, ctx) => {
    const res = validateName(val);
    if (!res.valid) ctx.addIssue({ code: z.ZodIssueCode.custom, message: res.message });
  }),
  email: z.string().superRefine((val, ctx) => {
    const res = validateEmail(val);
    if (!res.valid) ctx.addIssue({ code: z.ZodIssueCode.custom, message: res.message });
  }),
  phone: z.string().superRefine((val, ctx) => {
    const res = validatePhone(val);
    if (!res.valid) ctx.addIssue({ code: z.ZodIssueCode.custom, message: res.message });
  }),
  subject: z.string().superRefine((val, ctx) => {
    const res = validateSubject(val);
    if (!res.valid) ctx.addIssue({ code: z.ZodIssueCode.custom, message: res.message });
  }),
  message: z.string().superRefine((val, ctx) => {
    const res = validateMessage(val);
    if (!res.valid) ctx.addIssue({ code: z.ZodIssueCode.custom, message: res.message });
  }),
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
