import type { Metadata } from 'next';
import AnalyzeClient from './analyze-client';

export const metadata: Metadata = {
  title: 'Check a Car: Value, History and Fees',

  description:
    'Paste a listing link or enter a car’s details and CarPal checks its fair market value, vehicle history and dealer fees before you negotiate a price.',

  alternates: {
    canonical: '/analyze',
  },

  openGraph: {
    type: 'website',
    title: 'Check a Car: Value, History and Fees | CarPal',
    description:
      'Paste a listing link or enter a car’s details and CarPal checks its fair market value, vehicle history and dealer fees before you negotiate a price.',
    url: '/analyze',
    images: [
      {
        url: 'https://irp.cdn-website.com/aec24963/dms3rep/multi/opt/carpal-hero-sedan-1200w.png',
        alt: 'Graphite sedan in a studio, the kind of car CarPal helps you buy',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Check a Car: Value, History and Fees | CarPal',
    description:
      'Paste a listing link or enter a car’s details and CarPal checks its fair market value, vehicle history and dealer fees before you negotiate a price.',
    images: [
      'https://irp.cdn-website.com/aec24963/dms3rep/multi/opt/carpal-hero-sedan-1200w.png',
    ],
  },
};

export default function AnalyzePage() {
  return <AnalyzeClient />;
}