import { withAuth, type NextRequestWithAuth } from "next-auth/middleware";
import { type NextRequest } from "next/server";

export default async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/admin")) {
    return withAuth(req as NextRequestWithAuth, {
      callbacks: {
        authorized: ({ token }) => {
          if (token?.level !== "Admin") {
            return false;
          }

          return true;
        }
      },
      pages: {
        signIn: "/",
      },
    })
  }

  if (req.nextUrl.pathname.startsWith("/setting") || req.nextUrl.pathname.startsWith("/notes")) {
    return withAuth(req as NextRequestWithAuth, {
      pages: {
        signIn: "/login",
      },
    });
  }
}
