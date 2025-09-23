export { default } from "next-auth/middleware";

export const config = {
    matcher: ["/dashboard/:path*","/wedge/:path*","/irons/:path*","/driver/:path*","/putt/:path*","/rounds/:path*"],
};
