import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import NavbarComponent from "~/components/common/navbar";
import FooterComponent from "~/components/common/footer";
import AuthGuard from "../components/common/AuthGuard";


const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {


  return (
    <SessionProvider session={session}>
      <AuthGuard>
        <NavbarComponent />
        <Component {...pageProps} />
        <FooterComponent />
      </AuthGuard>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
