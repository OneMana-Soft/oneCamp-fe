export interface GenericResponse<T = unknown> {
    data: T
    msg?: string
    message?: string
    status: number

}