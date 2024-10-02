import { Inter } from 'next/font/google'
import './globals.css'
import {NextAuthProvider} from "@/app/Providers";
import {NavigationBar} from '@/components/component/navigation-bar';

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-inter',
})

export default function Layout({ children }) {
    return (
        <html lang="en">
        <body className={inter.variable}>
        <NextAuthProvider>
        {children}
        </NextAuthProvider>
        </body>
        </html>
    )
}