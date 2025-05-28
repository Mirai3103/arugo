import { hashPassword } from "@/util/password";
import { Prisma, PrismaClient } from "@prisma/client";
async function initResources(client: PrismaClient, withClean = false) {
	if (withClean) {
		await client.resource.deleteMany();
	}
	const resources: Prisma.ResourceCreateManyInput[] =
		Prisma.dmmf.datamodel.models.map((model) => {
			return {
				fields: model.fields.map((field) => field.name),
				resourceId: model.name,
				resourceName: model.name,
			};
		});
	await client.resource.createMany({
		data: resources,
	});
}

async function initActions(client: PrismaClient, withClean = false) {
	if (withClean) {
		await client.action.deleteMany();
	}
	const actions: Prisma.ActionCreateManyInput[] = [
		{
			actionId: "create",
			actionName: "Tạo mới",
		},
		{
			actionId: "read",
			actionName: "Xem",
		},
		{
			actionId: "update",
			actionName: "Cập nhật",
		},
		{
			actionId: "delete",
			actionName: "Xóa",
		},
		{
			actionId: "manage",
			actionName: "Quản lý (Tạo mới, Xem, Cập nhật, Xóa)",
		},
	];
	await client.action.createMany({
		data: actions,
	});
}

async function initRoles(client: PrismaClient, withClean = false) {
	if (withClean) {
		await client.role.deleteMany();
	}
	const adminRole: Prisma.JsonArray = [
		{
			action: ["manage"],
			subject: ["all"],
		},
	];
	const everyoneRole: Prisma.JsonArray = [
		{
			action: ["read"],
			subject: ["all"],
		},
	];

	const loginRole: Prisma.JsonArray = [
		{
			action: ["read"],
			subject: ["all"],
		},
	];

	const roles: Prisma.RoleCreateManyInput[] = [
		{
			roleId: "admin",
			roleName: "Quản trị viên",
			rules: adminRole,
		},
		{
			roleId: "everyone",
			roleName: "Người dùng chưa đăng nhập",
			description: "Đây là nhóm người dùng ẩn danh(chưa đăng nhập)",
			rules: everyoneRole,
		},
		{
			roleId: "logged-in",
			roleName: "Người dùng đã đăng nhập",
			description: "Đây là nhóm người dùng đã đăng nhập",
			rules: loginRole,
		},
	];
	await client.role.createMany({
		data: roles,
	});
}

async function initAdminUser(client: PrismaClient) {
	const isExistAdmin = await client.user.findFirst({
		where: {
			id: "admin",
		},
	});
	if (isExistAdmin) return;
	const newAdmin = await client.user.create({
		data: {
			email: "admin@gmail.com",
			id: "admin",
			name: "Admin",
			image: "https://placewaifu.com/image/200/200",
			hashPassword: hashPassword("admin@123"),
			emailVerified: new Date(),
			Role: {
				connect: {
					roleId: "admin",
				},
			},
		},
	});
	client.account.create({
		data: {
			provider: "credentials",
			userId: newAdmin.id,
			providerAccountId: "credentials",
			type: "email",
			createdAt: new Date(),
			updatedAt: new Date(),
		},
	});
}

async function main() {
	const prisma = new PrismaClient();
	await initResources(prisma, true);
	await initActions(prisma, true);
	await initRoles(prisma, true);
	await initAdminUser(prisma);
	return prisma;
}

main()
	.then((prisma) => {
		prisma.$disconnect();
	})
	.catch((e) => {
		console.error(e);
	});
