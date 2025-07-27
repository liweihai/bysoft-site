import NextAuth from 'next-auth';
import { NextRequest } from "next/server";
import {auth} from "@/auth";

export async function middleware(req: NextRequest) {
    // @ts-expect-error the type that auth returns is NOT a NextResponse but a plain Response
    const resp: Response = await auth(req);

    return resp;
}
 
export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
