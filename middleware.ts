export { default } from "next-auth/middleware";

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/wedge/:path*",
        "/irons/:path*",
        "/driver/:path*",
        "/putt/:path*",
        "/rounds/:path*",
        "!/api/auth/:path*", // ne futtass auth útvonalakon
        "!/login",           // ne futtass login oldalon
    ],
};
