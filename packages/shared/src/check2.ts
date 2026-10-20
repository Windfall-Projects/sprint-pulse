import { z } from "zod";
import { Database } from "./database.types";
import * as schemas from "./schemas/index";

type ProfilesRow = Database["public"]["Tables"]["profiles"]["Row"];
type ProfileSchemaType = z.infer<typeof schemas.ProfileSchema>;

const p1: ProfilesRow = {} as any as ProfileSchemaType;
const p2: ProfileSchemaType = {} as any as ProfilesRow;

type AccountsRow = Database["public"]["Tables"]["accounts"]["Row"];
type AccountSchemaType = z.infer<typeof schemas.AccountSchema>;

const a1: AccountsRow = {} as any as AccountSchemaType;
const a2: AccountSchemaType = {} as any as AccountsRow;
