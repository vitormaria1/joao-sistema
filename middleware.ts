import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (pathname === "/login") {
    const url = request.nextUrl.clone();
    url.pathname = "/bridge/login";
    url.search = search;
    return NextResponse.rewrite(url);
  }

  if (pathname === "/crm") {
    const url = request.nextUrl.clone();
    url.pathname = "/bridge/crm";
    url.search = search;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/crm"],
};
