import {MetaDbUrlDto} from "./meta-db-url.dto";

export interface SavedDbUrlDto {
    readonly value: string,
    readonly meta: MetaDbUrlDto,
}