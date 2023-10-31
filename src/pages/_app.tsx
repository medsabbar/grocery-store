import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import Header from "@/components/Header";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import PageHead from "@/components/PageHead";

// Create a client
const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  const { title, description } = pageProps;
  return (
    <SessionProvider session={pageProps.session}>
      <PageHead title={title} description={description} locale="en" />
      <QueryClientProvider client={queryClient}>
        <Header />
        <div className="max-w-4xl mx-auto">
          <Component {...pageProps} />
        </div>
      </QueryClientProvider>
      <Toaster />
    </SessionProvider>
  );
}
