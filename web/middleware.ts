import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 不需要驗證的路徑
const publicPaths = ['/login']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('token')?.value

  // 是否為公開路徑
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path))

  // 已登入用戶訪問登入頁面時重定向到首頁
  if (token && isPublicPath) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // 未登入用戶訪問需要認證的頁面時重定向到登入頁面
  if (!token && !isPublicPath) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * 匹配所有路徑，除了:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|login).*)',
  ],
} 