import { z } from "zod";
import { KudosSchema, KudosCategoryEnum } from "./packages/shared/src/schemas/index.ts";
import { Database } from "./packages/shared/src/database.types.ts";

type ZodKudos = z.infer<typeof KudosSchema>;
type DBKudos = Database["public"]["Tables"]["kudos"]["Row"];

const check1: ZodKudos = {} as DBKudos;
const check2: DBKudos = {} as ZodKudos;
