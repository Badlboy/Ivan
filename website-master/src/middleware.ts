import { NextResponse } from 'next/server'

export function middleware(req: any) {
    const url = req.nextUrl.clone()
    if (/[A-Z]/.test(url.pathname)) {
        url.pathname = url.pathname.toLowerCase()
        return NextResponse.redirect(url)
    }
    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
