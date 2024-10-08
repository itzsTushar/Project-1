class ApiError extends Error {
    constructor(
        statusCode,
        mesagge ="Something Went wrong",
        errors =[],
        stack=""
    ){
        super(mesagge)
        this.statusCode=statusCode
        this.data =null
        this.mesagge=mesagge
        this.errors=errors
        this.success=false
        if(stack){
            this.stack=stack
        }else{
            Error.captureStackTrace(this,this.constructor)
        }
    }
}
export {ApiError}