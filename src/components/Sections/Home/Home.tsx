
'use client'
import { Button } from '@/app/ui/button'
import { Reveal } from '@/app/blocks/reveal'
import { RuledFeatures } from '@/app/blocks/ruled-features'
import { FaqPanel } from '@/app/blocks/faq-panel'
import { ContactForm } from '@/app/blocks/contact-form'
import { PatternBackdrop } from '@/app/blocks/pattern-backdrop'
import { TextReveal } from '@/app/super-blocks/text-reveal'
import Link from 'next/link';
import { CarCheck } from "../Home/car-check";
import { CompareTable } from "../Home/compare-table";


const lots = [
  {
    title: "Discover",
    description: "Describe the car you are looking for. CarPal searches listings and shortlists the cars that fit.",
  },
  {
    title: "Evaluate",
    description: "Every car is checked for its fair market price and its history: owners, accidents, service gaps and recalls.",
  },
  {
    title: "Compare",
    description: "Set your finalists side by side on the full cost: price, fees, fuel and insurance.",
  },
  {
    title: "Negotiate",
    description: "Yes. CarPal negotiates with the dealership on your behalf. You review the final deal and approve it before anything is signed.",
  },
];

const sheetRows = [
  { label: "Dealer asking price", value: "$27,900", note: "" },
  { label: "CarPal market range", value: "$24,600 – $26,100", note: "Based on 41 similar cars within 120 miles" },
  { label: "Vehicle history", value: "1 owner, no accidents", note: "Two service gaps over 12 months" },
  { label: "Fees to question", value: "$2,495", note: "Dealer prep $995 and market adjustment $1,500" },
  { label: "Suggested first offer", value: "$24,400", note: "Out the door, fees included" },
];

const promises = [
  "We take no commission from dealerships.",
  "We run no paid or promoted listings.",
  "We show you every fee before you sign.",
  "You approve the final deal before anything is signed.",
];

const faqs = [
  {
    question: "Who does CarPal work for?",
    answer: "You. CarPal is paid by buyers and never by dealerships, so nothing in its advice is shaped by who wants to sell you a car.",
  },
  {
    question: "Can it help with a car I already found?",
    answer: "Yes. Paste in a listing and CarPal returns the market range, the history and any fees worth questioning before you speak to the seller.",
  },
  {
    question: "Does CarPal negotiate for me?",
    answer: "It drafts your offers and counter-offers and can message the dealership on your behalf. You approve every message before it goes out and you make the final call.",
  },
  {
    question: "New cars or used?",
    answer: "Both. For new cars CarPal focuses on invoice-versus-sticker gaps and add-ons; for used cars it adds history and condition checks.",
  },
  {
    question: "How much does CarPal cost?",
    answer: "CarPal charges a flat $499 only if you end up buying or leasing a car through us..",
  },
  {
    question: "How do I start?",
    answer: "Paste a listing link or enter the car's details, and CarPal takes it from there.",
  },
];

export default function Home() {
  return (
    <>
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 md:py-20 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-16">
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
            <p className="text-sm text-muted-foreground">Independent car-buying advocate</p>
            <h1 className="mt-4 font-display text-(length:--display-h1-size) leading-(--display-h1-leading) font-medium tracking-(--display-h1-tracking)">
              The dealership has a salesman. Now you have a pal.
            </h1>
            <p className="mt-6 max-w-prose text-lg text-muted-foreground md:text-xl">
              CarPal finds the right car, checks what it is really worth and negotiates with the dealership for you. We work for the buyer, not the dealership.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Button size="lg" nativeButton={false} render={<a href="#check" />}>
                Check a car, $499
              </Button>
              <a href="#how-it-works" className="text-base underline underline-offset-4 hover:text-primary">
                See how it works
              </a>
            </div>
          </div>
          <figure className="border border-border bg-surface p-3">
            <img
              src="https://irp.cdn-website.com/aec24963/dms3rep/multi/opt/carpal-hero-sedan-1200w.png"
              srcSet="https://irp.cdn-website.com/aec24963/dms3rep/multi/opt/carpal-hero-sedan-800w.png 800w, https://irp.cdn-website.com/aec24963/dms3rep/multi/opt/carpal-hero-sedan-1200w.png 1200w"
              sizes="(min-width: 1024px) 40vw, 92vw"
              width={1152}
              height={896}
              alt="Graphite grey sedan photographed against a pale studio backdrop"
              fetchPriority="high"
              className="aspect-[4/3] w-full object-cover"
            />
            <figcaption className="mt-3 flex items-baseline justify-between gap-4 border-t border-border pt-3 text-sm">
              <span className="font-display text-base">Lot 01 &middot; 2022 mid-size sedan</span>
              <span className="text-muted-foreground">31,400 mi</span>
            </figcaption>
          </figure>
        </div>
      </section>

      <section id="check" className="scroll-mt-20 border-b border-border bg-surface py-16 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16">
          <div>
            <h2 className="font-display text-(length:--display-h2-size) leading-(--display-h2-leading) font-medium tracking-(--display-h2-tracking)">
              Check a car before you talk price.
            </h2>
            <p className="mt-4 max-w-prose text-lg text-muted-foreground">
              Paste a listing or enter the details yourself. You get the fair market range, the history and every fee worth questioning.
            </p>
            <p className="mt-8 font-display text-5xl font-medium">$499</p>
            <p className="mt-1 text-muted-foreground">Flat fee, charged only if you buy or lease a car through CarPal.</p>
          </div>
          <CarCheck />
        </div>
      </section>

      <section id="how-it-works" className="scroll-mt-20 py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="max-w-3xl font-display text-(length:--display-h2-size) leading-(--display-h2-leading) font-medium tracking-(--display-h2-tracking)">
            Four jobs, one advocate, from first search to signed deal.
          </h2>
          <Reveal className="mt-12">
            <RuledFeatures items={lots} columns={4} numbered />
          </Reveal>
        </div>
      </section>

      <section id="compare" className="scroll-mt-20 py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="mb-12 max-w-3xl font-display text-(length:--display-h2-size) leading-(--display-h2-leading) font-medium tracking-(--display-h2-tracking)">
            How CarPal stacks up against the usual routes.
          </h2>
          <Reveal>
            <CompareTable />
          </Reveal>
        </div>
      </section>

      <section id="sample" className="scroll-mt-20 border-y border-border bg-surface py-16 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16">
          <Reveal>
            <figure>
              <img
                src="https://irp.cdn-website.com/aec24963/dms3rep/multi/opt/carpal-lot-suv-1200w.png"
                srcSet="https://irp.cdn-website.com/aec24963/dms3rep/multi/opt/carpal-lot-suv-800w.png 800w, https://irp.cdn-website.com/aec24963/dms3rep/multi/opt/carpal-lot-suv-1200w.png 1200w"
                sizes="(min-width: 1024px) 40vw, 92vw"
                width={1152}
                height={896}
                alt="White family SUV photographed against a pale studio backdrop"
                loading="lazy"
                className="aspect-[4/3] w-full object-cover"
              />
              <figcaption className="mt-3 border-t border-border pt-3 font-display text-base">
                Lot 02 &middot; 2021 family SUV
              </figcaption>
            </figure>
          </Reveal>
          <Reveal>
            <h2 className="font-display text-(length:--display-h2-size) leading-(--display-h2-leading) font-medium tracking-(--display-h2-tracking)">
              A clear report on every car.
            </h2>
            <p className="mt-4 max-w-prose text-lg text-muted-foreground">
              A sample report for the SUV above: what it is worth, which fees to question and the price we open negotiations at.
            </p>
            <dl className="mt-8 border-t border-foreground">
              {sheetRows.map((row) => (
                <div key={row.label} className="grid gap-1 border-b border-border py-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] sm:gap-6">
                  <dt className="text-muted-foreground">{row.label}</dt>
                  <dd>
                    <span className="font-display text-xl">{row.value}</span>
                    {row.note ? <span className="mt-0.5 block text-sm text-muted-foreground">{row.note}</span> : null}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-sm text-muted-foreground">Sample figures for illustration.</p>
          </Reveal>
        </div>
      </section>

      <section id="promise" className="scroll-mt-20 py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <TextReveal
            lines={["We work for the buyer.", "Not the dealership.", "Not the lender.", "Not the listing site."]}
            as="h2"
          />
          <div className="mt-16 grid items-center gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16">
            <ul className="border-t border-foreground">
              {promises.map((promise, i) => (
                <li key={promise} className="flex gap-4 border-b border-border py-4 text-lg">
                  <span className="font-display text-muted-foreground">0{i + 1}</span>
                  <span>{promise}</span>
                </li>
              ))}
            </ul>
            <figure>
              <img
                src="https://irp.cdn-website.com/aec24963/dms3rep/multi/opt/carpal-lot-hatchback-1200w.png"
                srcSet="https://irp.cdn-website.com/aec24963/dms3rep/multi/opt/carpal-lot-hatchback-800w.png 800w, https://irp.cdn-website.com/aec24963/dms3rep/multi/opt/carpal-lot-hatchback-1200w.png 1200w"
                sizes="(min-width: 1024px) 50vw, 92vw"
                width={1152}
                height={896}
                alt="Red compact hatchback photographed against a light grey studio backdrop"
                loading="lazy"
                className="aspect-[4/3] w-full object-cover"
              />
              <figcaption className="mt-3 border-t border-border pt-3 font-display text-base">
                Lot 03 &middot; 2023 compact hatchback
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section id="faq" className="scroll-mt-20 border-t border-border py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="mb-12 max-w-3xl font-display text-(length:--display-h2-size) leading-(--display-h2-leading) font-medium tracking-(--display-h2-tracking)">
            Questions buyers ask first.
          </h2>
          <FaqPanel items={faqs} />
        </div>
      </section>

      {/* <PatternBackdrop as="section" pattern="grid" fade="edges" glow className="scroll-mt-20 border-t border-border bg-surface py-16 md:py-24" id="start">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="font-display text-(length:--display-h2-size) leading-(--display-h2-leading) font-medium tracking-(--display-h2-tracking)">
              Buy your next car with someone on your side.
            </h2>
            <p className="mt-4 max-w-prose text-lg text-muted-foreground">
              Paste a listing or enter the details. CarPal does the checking.
            </p>
          </div>
          <div>
          <Button size="lg" nativeButton={false} render={<Link href="/analyze" />}>
            Check a car
          </Button>
          </div>
        </div>
      </PatternBackdrop> */}
    </>
  );
}
