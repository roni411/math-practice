import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh the session (keeps it alive)
  const { data: { user } } = await supabase.auth.getUser();

  // Protect /unsolved — redirect to /login if not authenticated
  if (request.nextUrl.pathname.startsWith("/unsolved") && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Already logged in and trying to access /login — redirect to /unsolved
  if (request.nextUrl.pathname === "/login" && user) {
    return NextResponse.redirect(new URL("/unsolved", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/unsolved", "/unsolved/:path*", "/login"],
};
