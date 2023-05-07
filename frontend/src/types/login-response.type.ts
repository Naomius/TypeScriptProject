export type LoginResponseType = {
    error: boolean,
    message: string,
    tokens: {
        accessToken?: string,
        refreshToken?: string,
    },
    user: {
        fullName: string,
        id: number,
    },
}