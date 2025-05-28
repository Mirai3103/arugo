import { z } from "zod";
const passwordSchema = z
	.string()
	.min(8, { message: "Mật khẩu phải có ít nhất 8 ký tự" })
	.max(100, { message: "Mật khẩu quá dài" })
	.regex(/[a-z]/, { message: "Phải có ít nhất một chữ thường" })
	.regex(/[A-Z]/, { message: "Phải có ít nhất một chữ hoa" })
	.regex(/[0-9]/, { message: "Phải có ít nhất một số" })
	.regex(/[^a-zA-Z0-9]/, { message: "Phải có ít nhất một ký tự đặc biệt" });

const usernameSchema = z
	.string()
	.min(3, { message: "Username phải có ít nhất 3 ký tự" })
	.max(30, { message: "Username không được dài quá 30 ký tự" })
	.regex(/^[a-zA-Z][a-zA-Z0-9_]*$/, {
		message:
			"Username chỉ được chứa chữ, số, dấu gạch dưới, và phải bắt đầu bằng chữ",
	});

export const emailLoginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(1),
});

export const emailRegisterSchema = z
	.object({
		email: z.string().email(),
		password: passwordSchema,
		confirmPassword: z.string().min(1),
		username: usernameSchema,
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Mật khẩu không khớp",
	});

export type EmailLoginSchema = z.infer<typeof emailLoginSchema>;
export type EmailRegisterSchema = z.infer<typeof emailRegisterSchema>;
