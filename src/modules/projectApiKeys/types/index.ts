import { Prisma } from "@prisma/client";
import { ApiKeysSelect } from "../constants";

export type TProjectApiKeysPayload = Prisma.ApiKeyGetPayload<{
  select: typeof ApiKeysSelect
}>

export type TProjectApiKeysResponse = Omit<TProjectApiKeysPayload, 'id'> & {
  id: string
}