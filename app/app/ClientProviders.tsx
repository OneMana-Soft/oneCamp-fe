"use client"

import { Provider } from "react-redux";
import store from "@/store/store";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MqttProvider } from "@/components/mqtt/mqttProvider";
import { Toaster } from "@/components/ui/toaster";
import { MediaQueryProvider } from "@/context/MediaQueryContext";
import { LoadingProvider } from "@/context/LoadingContext";
import "@/lib/env"; // Trigger validation on load

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <MediaQueryProvider>
        <LoadingProvider>
          <TooltipProvider delayDuration={400}>
            <MqttProvider>
              {children}
              <Toaster />
            </MqttProvider>
          </TooltipProvider>
        </LoadingProvider>
      </MediaQueryProvider>
    </Provider>
  );
}
