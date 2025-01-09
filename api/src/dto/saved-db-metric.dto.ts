import {MetaDbMetricDto} from "./meta-db-metric.dto";

export interface SavedDbMetricDto {
    readonly value: string,
    readonly meta: MetaDbMetricDto,
}