import { ErrorBase } from "./base.error";

export class BadRequestError extends ErrorBase {

    constructor(message: string) {
        super(400, message);
    }
    
}