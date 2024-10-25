import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metaData = {
  title: 'Chat App',
  description: 'OGI Chat App'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
          <Toaster position='top-center'/>
        {children}
      </body>
    </html>
  );
}
