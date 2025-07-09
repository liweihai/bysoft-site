import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { User } from '@auth/core/types';
import { z } from 'zod';

import {login} from "@/lib/data"
import {Customer} from "@/lib/definitions"
import {getModel} from "@/lib/data"

export const { auth, signIn, signOut } = NextAuth({
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
            async authorize(credentials) {
                const parsedCredentials = z
                .object({ username: z.string().min(6), password: z.string().min(6) })
                .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { username, password } = parsedCredentials.data;
                    const account = await login(username, password);

                    const customer = await getModel<Customer>("Customer", account.customer_id)

                    const user = {
                        name: customer.name,
                        id: customer.id,
                        image: customer.avatar,
                    }
                    return user;
                }
        
                return null;
            },
        }),
    ]
});