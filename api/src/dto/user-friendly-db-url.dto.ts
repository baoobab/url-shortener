export interface UserFriendlyDbUrlDto {
    readonly originalUrl: string,
    readonly clickCount: number,
    readonly expiresAt: Date | null,
    readonly createdAt: Date,
}