import { Injectable, NestMiddleware, Res } from "@nestjs/common";
import type { Response } from "express";

@Injectable()
export class LoggedInUserOnly implements NestMiddleware {
    use(req: any, @Res() res: Response, next: (error?: any) => void) {
        if (this.isValidUser(req.cookies['loggedInUser'])) {
            req.loggedInUser = this.getLoggedInUserId(req.cookies['loggedInUser'])
            next();
        } else {
            res.status(302).redirect("/login");
        }
    }

    isValidUser(cookie: string): boolean {
        if (!cookie || !cookie.includes("id=") || !cookie.includes("username=") || !cookie.includes("password="))
            return false;

        return true;
    }

    getLoggedInUserId(cookie: string): number {
        return parseInt(cookie.split(";")[0].split("=")[1])
    }

}