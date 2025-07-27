import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import GitHub from "next-auth/providers/github"
import { User } from '@auth/core/types';
import { z } from 'zod';
import { cookies } from "next/headers";

import {login, githubLogin} from "@/lib/data"
import {Customer} from "@/lib/definitions"
import {getModel} from "@/lib/data"

export const { handlers, signIn, signOut, auth } = NextAuth({
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;

            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
            if (isOnDashboard) {
                if (isLoggedIn) 
                    return true;

                return false; // Redirect unauthenticated users to login page
            } 

            return true;
        },

        async redirect({ url, baseUrl }) {
            // Allows relative callback URLs
            if (url.startsWith("/")) 
                return `${baseUrl}${url}`

            // Allows callback URLs on the same origin
            else if (new URL(url).origin === baseUrl) 
                return url
            
            return baseUrl
        },

        async signIn({user, account, profile, email, credentials}) {
            try {
                // 处理 GitHub 登录
                if (account && account.provider === 'github' && profile) {
                    await githubLogin(user.id, user.email, user.name, user.image);
                    
                    return true;
                }

                return true;
            } catch (error) {
                console.error("Error in signIn callback:", {user, account, profile, email, error});
                return false;
            }
        },

        async jwt({ token, user, profile }) {
            try {
                if (profile) {
                    let account = await githubLogin(user.id, user.email, user.name, user.image);

                    user.id = account.customer_id
                    user["access_token"] = account.token
                }

                if (user) { // User is available during sign-in
                    token.id = user.id
                    token.accessToken = user["access_token"]
                }
            } catch(error){
                console.error("jwt:", error)
            }

            return token
        },

        async session({ session, token }) {
            session.user.id = token.id as string

            return { ...session, token: token.accessToken }
        },
    },

    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },

    trustHost: true,

    providers: [
        GitHub({}),
        Credentials({
              credentials: {
                username: {
                    type: "text",
                    label: "用户名",
                },
                password: {
                    type: "password",
                    label: "密码",
                    placeholder: "*****",
                },
            },
            async authorize(credentials) {
                const account = await login(credentials?.username as string, credentials?.password as string);

                const customer = await getModel<Customer>("Customer", account.customer_id)

                const user = {
                    id: customer.id,
                    name: customer.name,
                    image: customer.avatar,
                    access_token: account.token
                }
                
                return user;
            },
        }),
    ],

    // 日志配置
    logger: {
        error(code, ...message) {
            console.error(code, message);
        },
        warn(code, ...message) {
            console.warn(code, message);
        },
        debug(code, ...message) {
            console.log(code, message);
        },
    },
});
