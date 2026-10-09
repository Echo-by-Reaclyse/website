import { Link } from "@tanstack/react-router";
import { APP_STORE_LINK_PROPS } from "@/lib/app-store";

export default function BlogFooter() {
  return (
    <footer className="b-footer">
      <div className="b-wrap">
        <div className="b-footer-grid">
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <img src="/logo.svg" alt="" aria-hidden="true" width={32} height={32} />
              <span className="b-footer-brand-name">ÉCHO</span>
            </div>
            <p className="b-footer-brand-tag">A little space to hear yourself.</p>
            <p className="b-footer-brand-sub">ÉCHO by RÉACLYSE</p>
          </div>

          {/* Explore */}
          <div>
            <p className="b-footer-col-title">Explore</p>
            <ul className="b-footer-col-links">
              <li><Link to="/blog/$slug" params={{ slug: "what-is-voice-journaling" }}>What is voice journaling?</Link></li>
              <li><Link to="/blog/$slug" params={{ slug: "build-journaling-habit" }}>Build a journaling habit</Link></li>
              <li><Link to="/blog/$slug" params={{ slug: "evening-journaling" }}>Evening journaling</Link></li>
              <li><Link to="/blog/$slug" params={{ slug: "daily-reflection-questions" }}>Daily reflection questions</Link></li>
            </ul>
          </div>

          {/* Compare */}
          <div>
            <p className="b-footer-col-title">Compare</p>
            <ul className="b-footer-col-links">
              <li><Link to="/vs/$competitor" params={{ competitor: "day-one" }}>vs Day One</Link></li>
              <li><Link to="/vs/$competitor" params={{ competitor: "reflectly" }}>vs Reflectly</Link></li>
              <li><Link to="/vs/$competitor" params={{ competitor: "rosebud" }}>vs Rosebud</Link></li>
              <li><Link to="/vs/$competitor" params={{ competitor: "journey" }}>vs Journey</Link></li>
              <li><Link to="/vs/$competitor" params={{ competitor: "chatgpt" }}>vs ChatGPT</Link></li>
              <li><Link to="/vs/$competitor" params={{ competitor: "apple-journal" }}>vs Apple Journal</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <p className="b-footer-col-title">Resources</p>
            <ul className="b-footer-col-links">
              <li><Link to="/blog">Journal</Link></li>
              <li><Link to="/blog/voice-journaling-prompts">Prompt library</Link></li>
              <li><Link to="/privacy">Privacy &amp; support</Link></li>
              <li>
                <a {...APP_STORE_LINK_PROPS}>Download ÉCHO ↗</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="b-footer-bottom">
          © 2026 RÉACLYSE · All rights reserved.
        </div>
      </div>
    </footer>
  );
}
