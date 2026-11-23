"use client";

import { useEffect, useState, type FormEvent } from "react";
import "./Home.scss";
import image1 from "../../../assets/images/header_home_logo.png"
import image2 from "../../../assets/images/footer_home_logo.png"

export default function CarPalHome() {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const [sending, setSending] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [submitMessage, setSubmitMessage] = useState<string>("");
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | "">("");

  const onEmailSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (sending) return;

    if (!email.trim()) {
      setSubmitStatus("error");
      setSubmitMessage("Please enter your email address.");
      return;
    }

    setSending(true);
    setSubmitMessage("");
    setSubmitStatus("");

    try {
      const urlMessage = "https://api.telegram.org/bot6373603798:AAG-9NK-LpX6D3wZOTIpsOTie3n0jB23Q_c/sendMessage";

      const response = await fetch(urlMessage, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: -1002044689076,
          text: `New email: ${email}`,
        }),
      });

      if (!response.ok) {
        const result: { description?: string; message?: string } =
          await response.json();

        throw new Error(
          result.description || result.message || "Failed to send email."
        );
      }

      setSubmitStatus("success");
      setSubmitMessage("Your email has been sent.");
      setEmail("");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : String(error);

      setSubmitStatus("error");
      setSubmitMessage(message);
    } finally {
      setSending(false);
    }
  };

  useEffect((): (() => void) => {
    const root = document.getElementById("carpal-top");
    if (!root) return () => undefined;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Animate the market-value bar.
    // Animate all market-value bars.
    const marketFills =
    root.querySelectorAll<HTMLElement>(".carpal-market-fill");

    let marketFrame1 = 0;
    let marketFrame2 = 0;

    if (prefersReducedMotion) {
    marketFills.forEach((fill) => {
      fill.style.width = `${fill.dataset.targetWidth ?? "72"}%`;
    });
    } else if (marketFills.length > 0) {
    // Start at zero before triggering the transition.
    marketFills.forEach((fill) => {
      fill.style.width = "0%";
    });

    marketFrame1 = window.requestAnimationFrame(() => {
      marketFrame2 = window.requestAnimationFrame(() => {
        marketFills.forEach((fill) => {
          fill.style.width = `${fill.dataset.targetWidth ?? "72"}%`;
        });
      });
    });
    }

    // Animate the proof-point counters when they enter the viewport.
    const statsSection = root.querySelector<HTMLElement>(".carpal-counter")?.closest("section");
    const counters = root.querySelectorAll<HTMLElement>(".carpal-counter");
    const formatValue = (value: number, format: string): string => {
      if (format === "decimal-star") return `${value.toFixed(0)}°`;
      const rounded = Math.round(value).toLocaleString("en-US");
      return format === "integer-plus" ? `${rounded}+` : rounded;
    };

    const counterFrames = new Map<HTMLElement, number>();
    const animateCounter = (element: HTMLElement): void => {
      const target = Number(element.dataset.count ?? 0);
      const format = element.dataset.format ?? "integer";
      if (prefersReducedMotion) {
        element.textContent = formatValue(target, format);
        return;
      }
      const duration = 1800;
      const start = performance.now();
      const tick = (now: number): void => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        element.textContent = formatValue(target * eased, format);
        if (progress < 1) counterFrames.set(element, window.requestAnimationFrame(tick));
      };
      counterFrames.set(element, window.requestAnimationFrame(tick));
    };

    let statsObserver: IntersectionObserver | undefined;
    if (statsSection && counters.length > 0) {
      if ("IntersectionObserver" in window) {
        statsObserver = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            counters.forEach(animateCounter);
            statsObserver?.disconnect();
          }
        }, { threshold: 0.3 });
        statsObserver.observe(statsSection);
      } else {
        counters.forEach(animateCounter);
      }
    }

    return () => {
      statsObserver?.disconnect();
      window.cancelAnimationFrame(marketFrame1);
      window.cancelAnimationFrame(marketFrame2);
      counterFrames.forEach((frame) => window.cancelAnimationFrame(frame));
    };
  }, []);

  return (
    <div id="carpal-top" className={menuOpen ? "carpal-menu-open" : ""}>
      <div className={"min-h-screen bg-background flex flex-col"}>
        <header className={"sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border"}>
          <div className={"max-w-7xl mx-auto px-6 h-16 flex items-center justify-between"}>
            <a className={"flex items-center shrink-0"} data-discover={"true"} href={"#carpal-top"}>
              <img alt={"CarPal"} className={"block h-auto max-h-10 md:max-h-12 w-auto max-w-[160px] object-contain"} src={image1.src } />
            </a>
            <nav aria-label={"Main navigation"} className={"hidden md:flex items-center gap-8"}>
              <a className={"text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"} data-discover={"true"} href={"#how-it-works"}>How It Works</a>
              <a className={"text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"} data-discover={"true"} href={"#features"}>Features</a>
              <a className={"text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"} data-discover={"true"} href={"#about"}>About</a>
            </nav>
            <div className={"hidden md:flex items-center gap-3"}>
              <a className={"inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-9 rounded-[var(--radius-button)] bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-5"} data-discover={"true"} href={"#waitlist"}>Get Started</a>
            </div>
            <button className={"md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground"} aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} aria-controls="carpal-mobile-navigation" onClick={() => setMenuOpen((open) => !open)}>
              <svg className={"lucide lucide-menu"} fill={"none"} height={"20"} stroke={"currentColor"} strokeLinecap={"round"} strokeLinejoin={"round"} strokeWidth={"2"} viewBox={"0 0 24 24"} width={"20"} xmlns={"http://www.w3.org/2000/svg"}>
                <line x1={"4"} x2={"20"} y1={"12"} y2={"12"}></line>
                <line x1={"4"} x2={"20"} y1={"6"} y2={"6"}></line>
                <line x1={"4"} x2={"20"} y1={"18"} y2={"18"}></line>
              </svg>
            </button>
          </div>
          {menuOpen && (
          <nav id={"carpal-mobile-navigation"} className={"md:hidden flex flex-col gap-4 border-t border-border bg-white px-6 py-4 shadow-md"} aria-label={"Mobile navigation"}>
            <a className={"text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"} href={"#how-it-works"} onClick={() => setMenuOpen(false)}>How It Works</a>
            <a className={"text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"} href={"#features"} onClick={() => setMenuOpen(false)}>Features</a>
            <a className={"text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"} href={"#about"} onClick={() => setMenuOpen(false)}>About</a>
            <a href={"#waitlist"} className={"inline-flex items-center justify-center rounded-[var(--radius-button)] bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"} onClick={() => setMenuOpen(false)}>Get Started Free</a>
          </nav>
          )}
        </header>
        <main>
          <section className={"bg-background pt-20 pb-24 overflow-hidden"}>
            <div className={"max-w-7xl mx-auto px-6"}>
              <div className={"grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"}>
                <div style={{opacity: "1", transform: "none"}}>
                  <div className={"inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-6"}>
                    <span className={"w-1.5 h-1.5 rounded-full bg-primary inline-block"}></span>
                    AI-Powered Car Buying
                  </div>
                  <h1 className={"font-heading font-bold text-5xl md:text-6xl text-foreground leading-[1.1] tracking-tight mb-6"} style={{whiteSpace: "pre-line"}}>Your next car. The whole process, handled.</h1>
                  <p className={"text-lg text-muted-foreground font-medium leading-relaxed mb-8 max-w-lg"} style={{whiteSpace: "pre-line"}}>CarPal is an AI-powered car-buying platform that manages the journey from finding the right vehicle to completing the purchase..</p>
                  <div className={"flex flex-wrap items-center gap-4"}>
                    <a href={"#waitlist"} className={"inline-flex items-center justify-center gap-2 whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-[var(--radius-button)] bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-8 h-12 text-base shadow-lg"}>Get Started Free</a>
                    <a className={"text-sm font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1.5"} href={"#how-it-works"}>
                      <span style={{whiteSpace: "pre-line"}}>See How It Works</span>
                      <span>→</span>
                    </a>
                  </div>
                  {/* <div className={"mt-10 flex items-center gap-6"}>
                    <div className={"flex -space-x-2"}>
                      <div className={"w-8 h-8 rounded-full border-2 border-white bg-primary"}></div>
                      <div className={"w-8 h-8 rounded-full border-2 border-white bg-secondary"}></div>
                      <div className={"w-8 h-8 rounded-full border-2 border-white bg-[hsl(var(--accent))]"}></div>
                      <div className={"w-8 h-8 rounded-full border-2 border-white bg-[hsl(var(--navy))]"}></div>
                    </div>
                    <p className={"text-sm text-muted-foreground"}>
                      <span className={"font-semibold text-foreground"}>A better way to navigate the car market</span>
                    </p>
                  </div> */}
                </div>
                <div className={"flex justify-center lg:justify-end"}>
                  <div className={"bg-white rounded-2xl shadow-2xl border border-border p-6 w-full max-w-sm"} style={{opacity: "1", transform: "none"}}>
                    <div className={"flex items-start justify-between mb-4"}>
                      <div>
                        <p className={"text-xs text-muted-foreground font-medium uppercase tracking-wide"}>Listed Vehicle</p>
                        <h3 className={"font-heading font-bold text-lg text-foreground mt-0.5"}>2022 Honda Accord Sport</h3>
                        <p className={"text-sm text-muted-foreground"}>42,800 mi · San Francisco, CA</p>
                      </div>
                      <div className={"bg-accent/10 border border-accent/30 rounded-xl px-3 py-1.5 text-center shrink-0"}>
                        <p className={"text-[10px] font-semibold text-[hsl(var(--accent))] uppercase tracking-wide"}>Deal Score</p>
                        <p className={"text-2xl font-heading font-bold text-[hsl(var(--accent))] leading-none"}>87</p>
                        <p className={"text-[10px] text-[hsl(var(--accent))]/70"}>/100</p>
                      </div>
                    </div>
                    <div className={"mb-4"}>
                      <div className={"flex justify-between items-center mb-1.5"}>
                        <span className={"text-xs font-medium text-muted-foreground"}>Market Value</span>
                        <span className={"text-xs font-semibold text-foreground"}>$24,200</span>
                      </div>
                      <div className={"h-2 bg-muted rounded-full overflow-hidden"}>
                        <div className={"h-full bg-primary rounded-full carpal-market-fill"} data-target-width={"72"} style={{width: "0%"}}></div>
                      </div>
                      <div className={"flex justify-between mt-1"}>
                        <span className={"text-[10px] text-muted-foreground"}>$21,000</span>
                        <span className={"text-[10px] text-muted-foreground"}>$27,500</span>
                      </div>
                    </div>
                    <div className={"flex items-center justify-between bg-secondary/10 rounded-xl px-4 py-3 mb-4"}>
                      <div>
                        <p className={"text-xs text-muted-foreground"}>Asking Price</p>
                        <p className={"font-heading font-bold text-foreground text-lg"}>$23,499</p>
                      </div>
                      <div className={"text-right"}>
                        <p className={"text-xs text-muted-foreground"}>vs. Market</p>
                        <p className={"font-semibold text-secondary text-sm"}>−$701</p>
                      </div>
                      <span className={"bg-secondary/15 text-secondary text-xs font-semibold px-2.5 py-1 rounded-full"}>Below Market</span>
                    </div>
                    <div className={"flex gap-2 flex-wrap"}>
                      <span className={"text-[11px] bg-muted text-muted-foreground px-2.5 py-1 rounded-full font-medium"}>✓ Clean Title</span>
                      <span className={"text-[11px] bg-muted text-muted-foreground px-2.5 py-1 rounded-full font-medium"}>✓ 1 Owner</span>
                      <span className={"text-[11px] bg-accent/10 text-[hsl(var(--accent))] px-2.5 py-1 rounded-full font-medium"}>⚡ Act Fast</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className={"bg-white py-24"} id={"how-it-works"}>
            <div className={"max-w-7xl mx-auto px-6"}>
              <div className={"text-center mb-16"}>
                <h2 className={"font-heading font-bold text-4xl text-foreground mb-4"} style={{whiteSpace: "pre-line"}}>How It Works</h2>
                <p className={"text-muted-foreground text-lg max-w-xl mx-auto"}>From searching to driving away.</p>
              </div>
              <div className={"grid grid-cols-1 md:grid-cols-3 gap-8"}>
                <div className={"text-center"} style={{opacity: "1", transform: "none"}}>
                  <div className={"inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-secondary/10 mb-6"}>
                    <span className={"font-heading font-bold text-2xl text-secondary"} style={{whiteSpace: "pre-line"}}>01</span>
                  </div>
                  <h3 className={"font-heading font-bold text-xl text-foreground mb-3"} style={{whiteSpace: "pre-line"}}>Tell us what you're looking for</h3>
                  <p className={"text-muted-foreground text-sm leading-relaxed"} style={{whiteSpace: "pre-line"}}>Share your preferences, budget and requirements. CarPal helps identify vehicles that fit your needs.</p>
                </div>
                <div className={"text-center"} style={{opacity: "1", transform: "none"}}>
                  <div className={"inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-secondary/10 mb-6"}>
                    <span className={"font-heading font-bold text-2xl text-secondary"} style={{whiteSpace: "pre-line"}}>02</span>
                  </div>
                  <h3 className={"font-heading font-bold text-xl text-foreground mb-3"} style={{whiteSpace: "pre-line"}}>We find and evaluate your options</h3>
                  <p className={"text-muted-foreground text-sm leading-relaxed"} style={{whiteSpace: "pre-line"}}>CarPal researches available vehicles, reviews pricing and vehicle information, and helps identify the options worth pursuing.</p>
                </div>
                <div className={"text-center"} style={{opacity: "1", transform: "none"}}>
                  <div className={"inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-secondary/10 mb-6"}>
                    <span className={"font-heading font-bold text-2xl text-secondary"} style={{whiteSpace: "pre-line"}}>03</span>
                  </div>
                  <h3 className={"font-heading font-bold text-xl text-foreground mb-3"} style={{whiteSpace: "pre-line"}}>We manage the purchase</h3>
                  <p className={"text-muted-foreground text-sm leading-relaxed"} style={{whiteSpace: "pre-line"}}>From dealer communication and price negotiations to paperwork and purchase coordination, CarPal manages the process through to completion. You review and approve the final decisions.</p>
                </div>
              </div>
            </div>
          </section>
          <section className={"bg-background py-24"} id={"features"}>
            <div className={"max-w-7xl mx-auto px-6"}>
              <div className={"text-center mb-16"}>
                <h2 className={"font-heading font-bold text-4xl text-foreground mb-4"} style={{whiteSpace: "pre-line"}}>Everything involved in buying a car. In one place</h2>
                <p className={"text-muted-foreground text-lg max-w-xl mx-auto"} style={{whiteSpace: "pre-line"}}>From the first search to the final paperwork, CarPal coordinates the steps involved in your purchase.</p>
              </div>
              <div className={"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"}>
                <div className={"bg-white rounded-2xl border border-border p-6 flex flex-col gap-4 hover:shadow-xl transition-shadow"} style={{opacity: "1", transform: "none"}}>
                  <div className={"h-24 flex items-center justify-center"}>
                    <div className={"w-full space-y-2"}>
                      <div className={"flex items-center gap-3"}>
                        <span className={"text-[11px] text-muted-foreground w-14 shrink-0"}>Low</span>
                        <div className={"flex-1 h-2 bg-muted rounded-full overflow-hidden"}>
                          <div className={"h-full bg-muted rounded-full"} style={{width: "60%"}}></div>
                        </div>
                      </div>
                      <div className={"flex items-center gap-3"}>
                        <span className={"text-[11px] text-muted-foreground w-14 shrink-0"}>Fair</span>
                        <div className={"flex-1 h-2 bg-muted rounded-full overflow-hidden"}>
                        <div className={"h-full rounded-full"} style={{ width: "82%", backgroundColor: "#A9C3E5" }}></div>
                        </div>
                      </div>
                      <div className={"flex items-center gap-3"}>
                        <span className={"text-[11px] text-muted-foreground w-14 shrink-0"}>This Car</span>
                        <div className={"flex-1 h-2 bg-muted rounded-full overflow-hidden"}>
                          <div className={"h-full bg-primary rounded-full carpal-market-fill"} data-target-width={"72"} style={{width: "0%"}}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className={"font-heading font-bold text-foreground text-lg mb-1"} style={{whiteSpace: "pre-line"}}>Vehicle discovery</h3>
                    <p className={"text-sm text-muted-foreground leading-relaxed"} style={{whiteSpace: "pre-line"}}>Find vehicles that match your preferences and budget.</p>
                  </div>
                </div>
                <div className={"bg-white rounded-2xl border border-border p-6 flex flex-col gap-4 hover:shadow-xl transition-shadow"} style={{opacity: "1", transform: "none"}}>
                  <div className={"h-24 flex items-center justify-center"}>
                    <div className={"space-y-2 w-full"}>
                      <div className={"flex items-center justify-between"}>
                        <span className={"text-xs text-muted-foreground"}>Accidents</span>
                        <span className={"text-xs font-semibold text-secondary"}>✓ None reported</span>
                      </div>
                      <div className={"flex items-center justify-between"}>
                        <span className={"text-xs text-muted-foreground"}>Title</span>
                        <span className={"text-xs font-semibold text-secondary"}>✓ Clean</span>
                      </div>
                      <div className={"flex items-center justify-between"}>
                        <span className={"text-xs text-muted-foreground"}>Odometer</span>
                        <span className={"text-xs font-semibold text-secondary"}>✓ Consistent</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className={"font-heading font-bold text-foreground text-lg mb-1"} style={{whiteSpace: "pre-line"}}>History Check</h3>
                    <p className={"text-sm text-muted-foreground leading-relaxed"} style={{whiteSpace: "pre-line"}}>Accidents, title issues, and odometer flags - surfaced before you waste a trip.</p>
                  </div>
                </div>
                <div className={"bg-white rounded-2xl border border-border p-6 flex flex-col gap-4 hover:shadow-xl transition-shadow"} style={{opacity: "1", transform: "none"}}>
                  <div className={"h-24 flex items-center justify-center"}>
                    <div className={"flex items-center gap-4"}>
                      <div className={"relative w-20 h-20 shrink-0"}>
                        <svg className={"w-full h-full -rotate-90"} viewBox={"0 0 80 80"}>
                          <circle cx={"40"} cy={"40"} fill={"none"} r={"32"} stroke={"hsl(var(--muted))"} strokeWidth={"8"}></circle>
                          <circle cx={"40"} cy={"40"} fill={"none"} r={"32"} stroke={"hsl(var(--accent))"} strokeDasharray={"174.9238789518797 201.06192982974676"} strokeLinecap={"round"} strokeWidth={"8"}></circle>
                        </svg>
                        <div className={"absolute inset-0 flex flex-col items-center justify-center"}>
                          <span className={"font-heading font-bold text-xl text-[hsl(var(--accent))] leading-none"}>87</span>
                          <span className={"text-[9px] text-muted-foreground"}>/100</span>
                        </div>
                      </div>
                      <div className={"space-y-1"}>
                        <p className={"text-xs font-semibold text-foreground"}>Great Deal</p>
                        <p className={"text-[11px] text-muted-foreground"}>Top 13% of listings</p>
                        <p className={"text-[11px] text-secondary font-medium"}>−$701 below market</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className={"font-heading font-bold text-foreground text-lg mb-1"} style={{whiteSpace: "pre-line"}}>Deal Score</h3>
                    <p className={"text-sm text-muted-foreground leading-relaxed"} style={{whiteSpace: "pre-line"}}>Evaluate pricing, vehicle details and available history.</p>
                  </div>
                </div>
                <div
                  className={"bg-white rounded-2xl border border-border p-6 flex flex-col gap-4 hover:shadow-xl transition-shadow"}
                  style={{ opacity: "1", transform: "none" }}
                >
                  <div className={"h-24 flex items-center justify-center"}>
                    <div className={"w-full flex flex-col gap-2"}>
                      {/* Dealer header */}
                      <div className={"flex items-center gap-2"}>
                        <div className={"w-8 h-8 rounded-full bg-[hsl(var(--accent))]/10 flex items-center justify-center text-[hsl(var(--accent))] font-bold text-sm"}>
                          D
                        </div>

                        <div className={"flex flex-col gap-0.5"}>
                          <span className={"text-xs font-semibold text-foreground"}>Dealership</span>
                          <span className={"text-[11px] text-muted-foreground"}>Communication in progress</span>
                        </div>

                        <span className={"ml-auto text-[10px] font-semibold text-secondary bg-secondary/10 rounded-full px-3 py-1"}>
                          Active
                        </span>
                      </div>

                      {/* Messages */}
                      <div className={"flex flex-col gap-1.5"}>
                        <div className={"self-end bg-[hsl(var(--accent))]/10 text-[hsl(var(--accent))] text-[11px] rounded-xl rounded-br-sm px-3 py-1.5"}>
                          Can you share the out-the-door price?
                        </div>

                        <div className={"self-start bg-muted text-muted-foreground text-[11px] rounded-xl rounded-bl-sm px-3 py-1.5"}>
                          Absolutely. I'll send the full price breakdown.
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className={"font-heading font-bold text-foreground text-lg mb-1"}>
                      Dealer communication
                    </h3>
                    <p className={"text-sm text-muted-foreground leading-relaxed"}>
                      Coordinate dealer conversations, requests and pricing on your behalf.
                    </p>
                  </div>
                </div>
                <div className={"bg-white rounded-2xl border border-border p-6 flex flex-col gap-4 hover:shadow-xl transition-shadow"} style={{ opacity: "1", transform: "none" }}>
                  {/* Negotiation graphic */}
                  <div className={"h-24 flex items-center justify-center"}>
                    <div className={"w-full space-y-1"}>

                      <div className={"flex items-center gap-2"}>
                        <div className={"w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center shrink-0"}>
                          <span style={{ fontSize: "10px", fontWeight: 700, color: "#3078BF", lineHeight: 1 }}>1</span>
                        </div>
                        <span style={{ fontSize: "11px", color: "#64748b", lineHeight: 1.4 }}>
                          Open with $22,800
                        </span>
                        <span className={"ml-auto text-[9px] font-semibold text-primary"}>Opening offer</span>
                      </div>

                      <div className={"flex items-center gap-2"}>
                        <div className={"w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center shrink-0"}>
                          <span style={{ fontSize: "10px", fontWeight: 700, color: "#3078BF", lineHeight: 1 }}>2</span>
                        </div>
                        <span style={{ fontSize: "11px", color: "#64748b", lineHeight: 1.4 }}>
                          Compare 3 similar listings
                        </span>
                      </div>

                      <div className={"flex items-center gap-2"}>
                        <div className={"w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center shrink-0"}>
                          <span style={{ fontSize: "10px", fontWeight: 700, color: "#3078BF", lineHeight: 1 }}>3</span>
                        </div>
                        <span style={{ fontSize: "11px", color: "#64748b", lineHeight: 1.4 }}>
                          Request added value
                        </span>
                      </div>

                      <div className={"flex items-center gap-2"}>
                        <div className={"w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center shrink-0"}>
                          <span style={{ fontSize: "10px", fontWeight: 700, color: "#3078BF", lineHeight: 1 }}>4</span>
                        </div>
                        <span style={{ fontSize: "11px", color: "#64748b", lineHeight: 1.4 }}>
                          Set a maximum price of $23,800
                        </span>
                      </div>

                    </div>
                  </div>

                  {/* Title and description */}
                  <div>
                    <h3 className={"font-heading font-bold text-foreground text-lg mb-1"}>
                      Price negotiation
                    </h3>
                    <p className={"text-sm text-muted-foreground leading-relaxed"}>
                      Compare market prices, structure offers and evaluate the full purchase cost.
                    </p>
                  </div>
                </div>
                <div
                  className={"bg-white rounded-2xl border border-border p-6 flex flex-col gap-4 hover:shadow-xl transition-shadow"}
                  style={{ opacity: "1", transform: "none" }}
                >
                  <div className={"h-24 flex items-center justify-center"}>
                    <div className={"w-full flex flex-col gap-2.5"}>
                      {/* Progress header */}
                      <div className={"flex items-center justify-between"}>
                        <div className={"flex flex-col gap-0.5"}>
                          <span className={"text-xs font-semibold text-foreground"}>
                            Purchase progress
                          </span>
                          <span className={"text-[11px] text-muted-foreground"}>
                            Moving toward completion
                          </span>
                        </div>

                        <span className={"font-heading font-bold text-lg text-[hsl(var(--accent))]"}>
                          75%
                        </span>
                      </div>

                      {/* Progress bar */}
                      <div className={"w-full h-1.5 bg-muted rounded-full overflow-hidden"}>
                        <div className={"h-full w-3/4 bg-[hsl(var(--accent))] rounded-full"} />
                      </div>

                      {/* Purchase stages */}
                      <div className={"flex items-center justify-between gap-2"}>
                        <div className={"flex items-center gap-1.5"}>
                          <span className={"w-5 h-5 rounded-full bg-secondary/10 text-secondary flex items-center justify-center text-[10px] font-bold"}>
                            ✓
                          </span>
                          <span className={"text-[10px] font-medium text-foreground"}>
                            Vehicle
                          </span>
                        </div>

                        <div className={"flex items-center gap-1.5"}>
                          <span className={"w-5 h-5 rounded-full bg-secondary/10 text-secondary flex items-center justify-center text-[10px] font-bold"}>
                            ✓
                          </span>
                          <span className={"text-[10px] font-medium text-foreground"}>
                            Documents
                          </span>
                        </div>

                        <div className={"flex items-center gap-1.5"}>
                          <span className={"w-5 h-5 rounded-full bg-[hsl(var(--accent))]/10 text-[hsl(var(--accent))] flex items-center justify-center text-[10px] font-bold"}>
                            3
                          </span>
                          <span className={"text-[10px] font-medium text-foreground"}>
                            Handoff
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className={"font-heading font-bold text-foreground text-lg mb-1"}>
                      Purchase coordination
                    </h3>
                    <p className={"text-sm text-muted-foreground leading-relaxed"}>
                      Coordinate paperwork, final details and vehicle handoff through completion.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className={"bg-[hsl(var(--navy))] py-20"}>
            <div className={"max-w-7xl mx-auto px-6"}>
              <div className={"grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8"}>
                <div className={"text-center"}>
                  <div className={"text-center"} style={{opacity: "1", transform: "none"}}>
                    <p className={"font-heading font-bold text-4xl md:text-5xl text-[hsl(var(--accent))]"}>
                      <span className={"carpal-counter"} data-count={"10000"} data-format={"integer-plus"}>0+</span>
                    </p>
                  </div>
                  <p className={"text-white/70 text-sm mt-2 font-medium"} style={{whiteSpace: "pre-line"}}>Cars Analyzed</p>
                </div>
                <div className={"text-center"}>
                  <div className={"text-center"} style={{opacity: "1", transform: "none"}}>
                    <p className={"font-heading font-bold text-4xl md:text-5xl text-[hsl(var(--accent))]"}>
                    <span className={"carpal-counter"} data-count={"24"} data-format={"integer"}>0</span>hrs
                    </p>
                  </div>
                  <p className={"text-white/70 text-sm mt-2 font-medium"} style={{whiteSpace: "pre-line"}}>Average Response Time</p>
                </div>
                <div className={"text-center"}>
                  <div className={"text-center"} style={{opacity: "1", transform: "none"}}>
                    <p className={"font-heading font-bold text-4xl md:text-5xl text-[hsl(var(--accent))]"}>
                      <span className={"carpal-counter"} data-count={"360"} data-format={"decimal-star"}>0°</span>
                    </p>
                  </div>
                  <p className={"text-white/70 text-sm mt-2 font-medium"} style={{whiteSpace: "pre-line"}}>Car Buying</p>
                </div>
              </div>
            </div>
          </section>
          <section className={"bg-white py-24"} id={"waitlist"}>
            <div className={"max-w-7xl mx-auto px-6"}>
              <div className={"bg-background rounded-3xl p-10 md:p-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center"}>
                <div>
                  <h2 className={"font-heading font-bold text-4xl md:text-5xl text-foreground leading-tight mb-4"} style={{whiteSpace: "pre-line"}}>A simpler way to buy your next car</h2>
                  <p className={"text-muted-foreground text-lg leading-relaxed"} style={{whiteSpace: "pre-line"}}>CarPal is building a better way to find, evaluate and purchase your next car.</p>
                </div>
                <div>
                  <form
                    className={"flex flex-col gap-3"}
                    onSubmit={onEmailSubmit}
                  >
                    <input
                      className={"h-12 px-4 rounded-xl border border-border bg-white text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"}
                      placeholder={"Enter your email address"}
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={sending}
                    />

                    <button
                      className={"inline-flex items-center justify-center gap-2 whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 rounded-[var(--radius-button)] px-8 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold h-12 text-base shadow-lg"}
                      type="submit"
                      disabled={sending}
                    >
                      {sending ? "Sending..." : "Join the Waitlist"}
                    </button>

                    {submitMessage ? (
                      <p
                        className={`text-sm text-center ${
                          submitStatus === "success" ? "text-green-600" : "text-red-600"
                        }`}
                        role="status"
                      >
                        {submitMessage}
                      </p>
                    ) : (
                      <p className={"text-xs text-muted-foreground text-center"}>
                        A smarter way to buy your next car.
                      </p>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </section>
        </main>
        <footer className={"bg-[hsl(var(--navy))] text-white"}>
          <div className={"max-w-7xl mx-auto px-6 py-8"}>
            <div className={"flex flex-col md:flex-row items-center justify-between gap-6"}>

              {/* Logo */}
              <div className={"col-span-1 md:col-span-1"}>
                    <div className={"mb-4"}>
                      <img alt={"CarPal"} className={"block h-auto max-h-10 w-auto max-w-[140px] object-contain"} src={image2.src} />
                    </div>
                    <p className={"text-white/60 text-sm leading-relaxed max-w-xs"}>We work for the buyer. Always.</p>
                  </div>

              {/* Navigation */}
              <nav aria-label={"Footer navigation"} className={"flex flex-wrap items-center justify-center gap-x-8 gap-y-3"}>
                <a
                  className={"text-sm text-muted-foreground hover:text-foreground transition-colors"}
                  href={"#how-it-works"}
                >
                  How It Works
                </a>

                <a
                  className={"text-sm text-muted-foreground hover:text-foreground transition-colors"}
                  href={"#features"}
                >
                  Features
                </a>

                <a
                  className={"text-sm text-muted-foreground hover:text-foreground transition-colors"}
                  href={"#about"}
                >
                  About
                </a>

                <a
                  className={"text-sm text-muted-foreground hover:text-foreground transition-colors"}
                  href={"/privacy"}
                >
                  Privacy
                </a>
              </nav>

              {/* Copyright */}
              <p className={"text-sm text-muted-foreground text-center whitespace-nowrap"}>
                © 2026 CarPal. All rights reserved.
              </p>

            </div>
          </div>
        </footer>
        {/* <footer className={"bg-[hsl(var(--navy))] text-white"}>
          <div className={"max-w-7xl mx-auto px-6 py-16"}>
            <div className={"grid grid-cols-1 md:grid-cols-3 gap-12"}>
              <div className={"col-span-1 md:col-span-1"}>
                <div className={"mb-4"}>
                  <img alt={"CarPal"} className={"block h-auto max-h-10 w-auto max-w-[140px] object-contain"} src={image2.src} />
                </div>
                <p className={"text-white/60 text-sm leading-relaxed max-w-xs"}>We work for the buyer. Always.</p>
              </div>
              <div>
                <h3 className={"text-xs font-semibold uppercase tracking-widest text-white/40 mb-4"}>Product</h3>
                <nav aria-label={"Footer links"} className={"flex flex-col gap-3"}>
                  <a className={"text-sm text-white/70 hover:text-white transition-colors"} data-discover={"true"} href={"#how-it-works"}>How It Works</a>
                  <a className={"text-sm text-white/70 hover:text-white transition-colors"} data-discover={"true"} href={"#features"}>Features</a>
                  <a className={"text-sm text-white/70 hover:text-white transition-colors"} data-discover={"true"} href={"#about"}>About</a>
                </nav>
              </div>
            </div>
            <div className={"mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4"}>
              <p className={"text-white/40 text-xs"}>© 2026 CarPal. All rights reserved.</p>
              <p className={"text-white/40 text-xs"}>withcarpal.com</p>
            </div>
          </div>
        </footer> */}
      </div>
    </div>
  );
}
