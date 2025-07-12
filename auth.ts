import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { User } from '@auth/core/types';
import { z } from 'zod';

import {login} from "@/lib/data"
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

        jwt({ token, user }) {
            if (user) { // User is available during sign-in
                token.id = user.id
            }

            return token
        },

        session({ session, token }) {
            session.user.id = token.id as string
            return session
        },
    },
    trustHost: true,
    providers: [
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
                const parsedCredentials = z
                .object({ username: z.string().min(6), password: z.string().min(6) })
                .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { username, password } = parsedCredentials.data;
                    const account = await login(username, password);

                    const user = {
                        id: account.customer_id,
                        name: account.token
                    }
                    
                    return user;
                }
        
                return null
            },
        }),
    ]
});