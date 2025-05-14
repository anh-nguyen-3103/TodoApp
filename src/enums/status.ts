export enum Status {
    Idle = 'idle',
    Pending = 'pending',
    Succeeded = 'succeeded',
    Failed = 'failed',
}

export enum HTTPStatusCode {
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    INTERNAL_SERVER_ERROR = 500,
}
