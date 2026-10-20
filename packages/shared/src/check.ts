import { z } from "zod";
import { Database } from "./database.types";
import * as schemas from "./schemas/index";

type Expect<T extends true> = T;
type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false;

type ProfilesRow = Database["public"]["Tables"]["profiles"]["Row"];
type AccountsRow = Database["public"]["Tables"]["accounts"]["Row"];
type TeamsRow = Database["public"]["Tables"]["teams"]["Row"];

// Test some basic models
type ProfileSchemaType = z.infer<typeof schemas.ProfileSchema>;
type _ProfileCheck = Expect<Equal<ProfileSchemaType, ProfilesRow>>;

type AccountSchemaType = z.infer<typeof schemas.AccountSchema>;
type _AccountCheck = Expect<Equal<AccountSchemaType, AccountsRow>>;
