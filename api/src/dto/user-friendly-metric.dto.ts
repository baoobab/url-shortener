import {UserFriendlyMetricMetaDto} from "./user-friendly-metric-meta.dto";

export interface UserFriendlyMetricDto {
    readonly originalUrl: string,
    readonly clickCount: number,
    readonly metrics: UserFriendlyMetricMetaDto[]
}