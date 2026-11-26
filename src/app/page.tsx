import type { Metadata } from "next";
import HomeClient from "@/app/home-client/home-client";
import settings from '@/config/settings.json';

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://withcarpal.com"
  ),
  title: {
    default: "CarPal | Independent AI Car Buying Advocate",
    template: "%s | CarPal",
  },
  alternates: {
    canonical: "/",
  },
  description:
    'CarPal is your AI car-buying advocate: find the right car, check its market value and history, compare options and negotiate with dealerships. We work for you.',
  openGraph: {
    type: 'website',
    title: 'CarPal | Independent AI Car Buying Advocate',
    description:
      'CarPal finds the right car, checks its market value and history, compares options and negotiates the deal with you.',
    url: '/',
    images: [
      {
        url: 'https://irp.cdn-website.com/aec24963/dms3rep/multi/opt/carpal-hero-sedan-1200w.png',
        alt: 'Graphite sedan in a studio, the kind of car CarPal helps you buy',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'CarPal | Independent AI Car Buying Advocate',
    description:
      'CarPal finds the right car, checks its market value and history, compares options and negotiates the deal with you.',
    images: [
      'https://irp.cdn-website.com/aec24963/dms3rep/multi/opt/carpal-hero-sedan-1200w.png',
    ],
  },
};

// Reuse the FAQ structured data already defined in settings.json.
const faqScript = settings.routes['/'].scripts.find(
  (script) => script.type === 'application/ld+json'
);

const faqSchema = faqScript
  ? JSON.parse(faqScript.children)
  : null;

export default function Page() {
  return (
    <>
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema).replace(/</g, '\\u003c'),
          }}
        />
      )}

      <HomeClient />
    </>
  );
}