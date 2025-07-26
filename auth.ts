import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import GitHub from "next-auth/providers/github"
import { User } from '@auth/core/types';
import { z } from 'zod';

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
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page
            } 
            return true;
        },

        async signIn({user, account, profile, email, credentials}) {
            try {
                console.log("Sign In Callback:", {user, account, profile, email});

                // 处理 GitHub 登录
                if (account && account.provider === 'github' && profile) {
                    await githubLogin(user.id, user.email, user.name, user.image);
                    
                    return true;
                }

                return true;
            } catch (error) {
                console.error("Error in signIn callback:", error);
                return false;
            }
        },

        async jwt({ token, user, profile }) {
            if (profile) {
                try {
                    let account = await githubLogin(user.id, user.email, user.name, user.image);

                    user.id = account.customer_id
                    user["access_token"] = account.token
                } catch(err){
                    console.error(err)
                }
            }

            if (user) { // User is available during sign-in
                token.id = user.id
                token.accessToken = user["access_token"]
            }

            console.log("jwt:", token, user, profile)
            return token
        },

        async session({ session, token }) {
            console.log("session:", token, session)

            session.user.id = token.id as string

            return { ...session, token: token.accessToken }
        },
    },

    session: {
        strategy: "jwt",
    },

    trustHost: true,

    providers: [
        GitHub({
            clientId: 'Ov23liArfIaEtx5i7Xth',
            clientSecret: '69a77b0de5836458f8c6dc737636400910c08291'
        }),
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

    // 认证事件处理
    events: {
        async signIn(message) {
            console.log("User signed in:", message)
        },
        async signOut(message) {
            console.log("User signed out:", message)
        },
        async createUser(message) {
            console.log("User created:", message)
        },
        async linkAccount(message) {
            console.log("Account linked:", message)
        },
        async session(message) {
            console.log("Session created:", message)
        },
    },

    // 开发环境启用调试模式
    debug: process.env.NODE_ENV === 'development',

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
