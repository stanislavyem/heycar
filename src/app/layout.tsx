
import type { Metadata } from "next";
import type { ReactNode } from "react";
import "../assets/css/global.scss";

import { Context } from "@/providers/Context";
import settings from "@/config/settings.json";
import { Navbar } from "@/app/blocks/navbar";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl || "https://withcarpal.com"),

  title: {
    default: "CarPal | Independent AI Car Buying Advocate",
    template: "%s | CarPal",
  },

  description:
    "CarPal is your AI car-buying advocate: find the right car, check its market value and history, compare options and negotiate with dealerships. We work for you.",

  applicationName: "CarPal",
  authors: [{ name: "CarPal" }],
  creator: "CarPal",

  icons: {
    icon: settings.site.links.find((link) => link.rel === "icon")?.href,
  },

  openGraph: {
    type: "website",
    siteName: "CarPal",
    title: "CarPal | Independent AI Car Buying Advocate",
    description:
      "Find the right car, check its market value and history, compare options and negotiate with dealerships.",
    images: [
      {
        url: "https://irp.cdn-website.com/aec24963/dms3rep/multi/opt/carpal-hero-sedan-1200w.png",
        alt: "Graphite sedan in a studio, the kind of car CarPal helps you buy",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "CarPal | Independent AI Car Buying Advocate",
    description:
      "Find the right car, check its market value and history, compare options and negotiate with dealerships.",
    images: [
      "https://irp.cdn-website.com/aec24963/dms3rep/multi/opt/carpal-hero-sedan-1200w.png",
    ],
  },
};

const links = [
  // { label: "Check a car", href: "/analyze" },
  { label: "Compare", href: "/#compare" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "Sample sheet", href: "/#sample" },
  { label: "Our promise", href: "/#promise" },
  { label: "FAQ", href: "/#faq" },
];

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Context>
          <Navbar
            layout="bar"
            brand={
              <img
                src={settings.logo.src}
                alt={settings.logo.alt}
                width={2172}
                height={724}
                className="h-10 w-auto mix-blend-multiply"
              />
            }
            links={links}
            cta={{ label: "Check a car", href: "/analyze" }}
          />

          <main>{children}</main>

          <footer className="border-t border-border bg-surface">
            <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-12 sm:px-6 md:flex-row md:items-end md:justify-between">
              <div>
                <img
                  src={settings.logo.src}
                  alt={settings.logo.alt}
                  width={2172}
                  height={724}
                  className="h-9 w-auto mix-blend-multiply"
                />
                <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                  Your independent car-buying advocate. We work for the buyer,
                  never the dealership.
                </p>
              </div>

              <p className="text-sm text-muted-foreground">
                &copy; 2026 CarPal. All rights reserved.
              </p>
            </div>
          </footer>
        </Context>
      </body>
    </html>
  );
}
