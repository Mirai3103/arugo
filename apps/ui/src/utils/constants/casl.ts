import { createAliasResolver, type createMongoAbility } from "@casl/ability";

export enum Actions {
  MANAGE = "manage",
  CREATE = "create",
  READ_OWN = "read:own",
  READ_ANY = "read:any",
  UPDATE_OWN = "update:own",
  UPDATE_ANY = "update:any",
  DELETE_OWN = "delete:own",
  DELETE_ANY = "delete:any",
  READ = "read",
  EDIT = "edit",
  TRY = "try",
}
type CreateMongoAbilityFirstArg = Parameters<typeof createMongoAbility>[0];

export const testAbility: CreateMongoAbilityFirstArg = [];

export const resolveAction = createAliasResolver({
  [Actions.READ_ANY]: ["read"],
  [Actions.UPDATE_OWN]: ["read:own"],
  [Actions.UPDATE_ANY]: ["update", "read:any"],
  [Actions.DELETE_ANY]: ["delete", "update:any"],
  [Actions.DELETE_OWN]: ["read:own"],
});
