import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import "./index-shein.css";

const LOGO = "https://i.pinimg.com/1200x/70/73/41/70734124a5f4b3550f28dc1e406880dc.jpg";

const TOASTS = [
  { name: "Ashley M.", desc: "just claimed $750 in Texas" },
  { name: "Jessica R.", desc: "unlocked her bonus in Florida" },
  { name: "Maria G.", desc: "claimed $750 in California" },
  { name: "Emily T.", desc: "just cashed out in New York" },
  { name: "Sophia L.", desc: "unlocked her credit in Ohio" },
  { name: "Olivia P.", desc: "claimed $750 in Georgia" },
  { name: "Hannah W.", desc: "just claimed in Arizona" },
  { name: "Chloe D.", desc: "unlocked $750 in Illinois" },
];

function fmt(n: number) {
  return n.toLocaleString("en-US");
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Claim Your $750 Shein Bonus" },
      {
        name: "description",
        content:
          "Shein is giving away $750 in free credit to select shoppers today. Claim your reserved bonus before it expires.",
      },
      { name: "theme-color", content: "#f5d8b0" },
      { property: "og:title", content: "Claim Your $750 Shein Bonus" },
      {
        property: "og:description",
        content: "Shein is giving away $750 in free credit to select shoppers today.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,400&family=Bricolage+Grotesque:wght@700;800&display=swap",
      },
      { rel: "canonical", href: "/" },
    ],
  }),
  component: SheinBonus,
});

function SheinBonus() {
  const [started, setStarted] = useState(false);
  const [liveCount, setLiveCount] = useState(12864);
  const [dollars, setDollars] = useState(847500);
  const [secondsLeft, setSecondsLeft] = useState(14 * 60 + 59);
  const [showSticky, setShowSticky] = useState(false);
  const [toast, setToast] = useState<{ name: string; desc: string; key: number } | null>(null);
  const [leaving, setLeaving] = useState(false);
  const toastIdx = useRef(0);

  // Live shopper counter
  useEffect(() => {
    const id = setInterval(() => {
      setLiveCount((c) => c + Math.floor(Math.random() * 3) + 1);
    }, 3500);
    return () => clearInterval(id);
  }, []);

  // Countdown + dollars when started
  useEffect(() => {
    if (!started) return;
    const id = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
      setDollars((d) => d + Math.floor(Math.random() * 80) + 20);
    }, 1000);
    return () => clearInterval(id);
  }, [started]);

  // Sticky CTA on scroll
  useEffect(() => {
    if (!started) return;
    const onScroll = () => setShowSticky(window.scrollY > 320);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [started]);

  // Notification toasts when started
  useEffect(() => {
    if (!started) return;
    let timeout: ReturnType<typeof setTimeout>;
    const show = () => {
      const t = TOASTS[toastIdx.current % TOASTS.length];
      toastIdx.current += 1;
      setLeaving(false);
      setToast({ ...t, key: Date.now() });
      timeout = setTimeout(() => {
        setLeaving(true);
        timeout = setTimeout(() => setToast(null), 300);
      }, 4000);
    };
    const first = setTimeout(show, 2000);
    const id = setInterval(show, 7000);
    return () => {
      clearTimeout(first);
      clearTimeout(timeout);
      clearInterval(id);
    };
  }, [started]);

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  const handleClaim = () => {
    // Replace with your offer URL.
    window.alert("Continue to claim your $750 Shein bonus!");
  };

  return (
    <div className="shein-page">
      <div className="ambient" />

      {/* ===== AGE GATE ===== */}
      {!started && (
        <section className="age-quiz">
          <div className="quiz-wrap">
            <div className="quiz-badge">
              <img src={LOGO} alt="Shein" />
              <span>Shein Rewards</span>
            </div>
            <h1 className="quiz-heading">
              Claim Your <span className="accent">$750 Bonus</span>
            </h1>
            <p className="quiz-sub">
              Shein is giving away $750 in free credit to select shoppers today — and your spot is
              still open. Don't let someone else claim it.
            </p>
            <div className="live-counter">
              <span className="live-dot" />
              <span>
                <span className="live-num">{fmt(liveCount)}</span>shoppers claiming now
              </span>
            </div>
            <div className="age-options">
              <button className="age-btn primary" onClick={() => setStarted(true)}>
                <div className="age-label">I'm 18 or older</div>
                <div className="age-desc">Eligible for the full $750 bonus</div>
              </button>
              <button className="age-btn secondary" onClick={() => setStarted(true)}>
                <div className="age-label">I'm under 18</div>
                <div className="age-desc">Eligible for $250 voucher</div>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ===== MAIN CONTENT ===== */}
      {started && (
        <div className="scroll-content active">
          {toast && (
            <div className="notif-zone">
              <div className={`notif-toast${leaving ? " leaving" : ""}`} key={toast.key}>
                <div className="notif-icon">
                  <img src={LOGO} alt="" />
                </div>
                <div className="notif-body">
                  <div className="notif-title">{toast.name}</div>
                  <div className="notif-desc">{toast.desc}</div>
                </div>
                <div className="notif-time">just now</div>
              </div>
            </div>
          )}

          <div className="main-wrap">
            <div className="logo-row">
              <div className="logo-pill">
                <img src={LOGO} alt="Shein" />
              </div>
            </div>

            <div className="countdown-bar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>
                Offer expires in <span className="timer">{mm}:{ss}</span>
              </span>
            </div>

            <h1 className="main-heading">
              Your <span className="g">$750</span> Bonus Is Reserved
            </h1>

            <div className="dollar-counter">
              <span>🎁 ${fmt(dollars)}+ in bonuses claimed today</span>
            </div>

            <p className="main-sub">
              Your spot is held. Start below — enter your email, answer a few quick questions, and
              your $750 Shein credit unlocks instantly.
            </p>

            <button className="cta" onClick={handleClaim}>
              <svg
                className="cta-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <rect x="2" y="7" width="20" height="5" rx="1" />
                <path d="M12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
              </svg>
              Claim My $750 Now — It's Free
            </button>

            <div className="payout-row">
              <div className="payout-icon">👜</div>
              <div className="payout-icon">👗</div>
              <div className="payout-icon">👟</div>
              <div className="payout-icon">💄</div>
              <span className="payout-label">Free shipping included</span>
            </div>

            <div className="steps-card">
              <div className="steps-title">3 steps — most finish in 4 minutes</div>
              <div className="step-item">
                <div className="step-num">1</div>
                <div className="step-text">
                  <b>Enter Your Email</b>
                  <span>Takes 30 seconds — no credit card, no catch</span>
                </div>
              </div>
              <div className="step-item">
                <div className="step-num">2</div>
                <div className="step-text">
                  <b>Answer a Few Quick Questions</b>
                  <span>
                    Just your style &amp; shopping preferences — helps us personalize your $750 haul
                  </span>
                </div>
              </div>
              <div className="step-item">
                <div className="step-num">3</div>
                <div className="step-text">
                  <b>
                    Complete 3–5 Sponsor Deals to Unlock Your Cash
                    <span className="required-badge">REQUIRED</span>
                  </b>
                  <span>
                    Pick any deals from our partners — then your full balance unlocks and is yours
                    to cash out
                  </span>
                </div>
              </div>
            </div>

            <div className="urgency">
              <div className="urgency-icon">🔥</div>
              <div>
                <div className="urgency-text">
                  Almost there — don't stop at Step 2. Your balance only unlocks after you{" "}
                  <strong>complete your sponsor deals</strong>. Most people who quit early miss out
                  entirely.
                </div>
                <div className="urgency-tip">
                  <strong>💡 Pro tip:</strong> If your deal involves a purchase, you get 10x that
                  amount in credit — spend $10, cash out $100.
                </div>
              </div>
            </div>

            <div className="trust-bar">
              <div className="trust-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path
                    d="M12 2 4 5v6c0 5 3.5 8.5 8 11 4.5-2.5 8-6 8-11V5l-8-3z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>100% Free</span>
              </div>
              <div className="trust-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>500K+ claimed</span>
              </div>
              <div className="trust-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path
                    d="m12 2 3 6.5 7 .9-5 4.8 1.3 6.8L12 17.8 5.4 21l1.3-6.8-5-4.8 7-.9L12 2z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>4.8 rated</span>
              </div>
            </div>

            <div className="foot">
              Finish all 3 steps to receive your full $750 Shein bonus
            </div>
          </div>

          <div className={`sticky-cta${showSticky ? " visible" : ""}`}>
            <button className="cta-sm" onClick={handleClaim}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="7" width="20" height="14" rx="2" />
                <path d="M12 7V21" strokeLinecap="round" />
              </svg>
              Claim My $750 Now — It's Free
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
