import {
  createTag,
  deleteTag,
  getAllTags,
  updateTag,
} from "@/server/transports/server-functions/tag";
import type { CreateTagSchema, UpdateTagSchema } from "@/validations/tag";

export function getAllTagsQueryOptions() {
  return {
    queryKey: ["tags"],
    queryFn: () => getAllTags(),
  };
}

export function getTagByIdQueryOptions(tagId: number) {
  return {
    queryKey: ["tag", tagId],
    queryFn: () => getAllTags(),
  };
}
export function getCreateTagMutationOptions() {
  return {
    mutationKey: ["createTag"],
    mutationFn: (data: CreateTagSchema) =>
      createTag({
        data,
      }),
  };
}

export function getUpdateTagMutationOptions() {
  return {
    mutationKey: ["updateTag"],
    mutationFn: (data: UpdateTagSchema) =>
      updateTag({
        data,
      }),
  };
}
export function getDeleteTagMutationOptions() {
  return {
    mutationKey: ["deleteTag"],
    mutationFn: (data: number) =>
      deleteTag({
        data,
      }),
  };
}
