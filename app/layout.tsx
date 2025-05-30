"use client"

import "./globals.css";
import {ThemeProvider} from "@/components/themeProvider/theme-provider";
import store, { persistor } from "@/store/store";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import {MediaQueryProvider} from "@/context/MediaQueryContext";



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

          <html lang="en" >

          <body>
          <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
              <PersistGate loading={null} persistor={persistor}>
                  <Provider store={store}>
                      <MediaQueryProvider>
                          <div className='select-none relative h-[100vh] bg-gray-50 dark:bg-gray-900 transition-colors duration-500'>
                              {children}
                          </div>
                      </MediaQueryProvider>
                  </Provider>
              </PersistGate>
          </ThemeProvider>
          </body>


          </html>


  );
}
