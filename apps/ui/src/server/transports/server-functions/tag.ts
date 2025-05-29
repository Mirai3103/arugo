import tagService from "@repo/backend/problems/tagService";
import { createTagSchema, updateTagSchema } from "@repo/backend/problems/validations/tag";
import { createServerFn } from "@tanstack/react-start";

import { z } from "zod";
export const getAllTags = createServerFn().handler(async () => {
	return tagService.getAllTags();
});
export const createTag = createServerFn({
	method: "POST",
})
	.validator(createTagSchema)
	.handler(async ({ data }) => {
		return tagService.createTag(data);
	});
export const updateTag = createServerFn({
	method: "POST",
})
	.validator(updateTagSchema)
	.handler(async ({ data }) => {
		return tagService.updateTag(data);
	});
export const deleteTag = createServerFn({
	method: "POST",
})
	.validator(z.coerce.number())
	.handler(async ({ data }) => {
		await tagService.deleteTag(data);
		return { success: true };
	});
export const getTagById = createServerFn({
	method: "GET",
})
	.validator(updateTagSchema)
	.handler(async ({ data }) => {
		return tagService.getTagById(data.id);
	});
