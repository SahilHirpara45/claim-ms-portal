// import ".../assets/scss/globals.scss";
import "./assets/scss/theme.scss";
import "./assets/scss/globals.scss";
// import "react-datepicker/dist/react-datepicker.css";
import { Inter } from "next/font/google";
import { siteConfig } from "@/config/site";
import Providers from "@/provider/providers";
import "simplebar-react/dist/simplebar.min.css";
import TanstackProvider from "@/provider/providers.client";
import AuthProvider from "@/provider/auth.provider";
import "flatpickr/dist/themes/light.css";
import DirectionProvider from "@/provider/direction.provider";
import SocketProvider from "../components/scoket/SocketConnection";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

export default function RootLayout({ children, params: { lang } }) {
  return (
    <html lang={lang}>
      <AuthProvider>
        <Providers>
          <TanstackProvider>
            <SocketProvider>
              <DirectionProvider lang={lang}>{children}</DirectionProvider>
            </SocketProvider>
          </TanstackProvider>
        </Providers>
      </AuthProvider>
    </html>
  );
}
