class ApiResponse {
    constructor(statusCode,data,mesagge="Success"){
        this.statusCode=statusCode
        this.data=data
        this.mesagge=mesagge
        this.success = statusCode<400
    }
}
export {ApiResponse}
