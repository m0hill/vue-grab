import { LogoText } from "./logo-text";
import { ActivateTab } from "./activate-tab";
import { ConversationExample } from "./conversation-example";

export const HeroSection = () => (
  <div className="relative min-h-screen w-full overflow-hidden px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
    <div className="mx-auto max-w-2xl">
      <div className="flex flex-col gap-2 lg:gap-4">
        <div className="flex flex-col gap-4">
          <LogoText size="lg" />

          <p className="text-base text-[#9D9D9D] font-grotesk leading-relaxed">
            Grab any element on in your app and give it to Cursor, Claude Code,
            etc. to change.
          </p>
        </div>

        <ActivateTab />

        <div className="flex flex-col gap-6">
          <p className="text-base text-[#9D9D9D] font-grotesk leading-relaxed">
            By default coding agents cannot access elements on your page. React
            Grab fixes this - just point and click to provide context!
          </p>

          <ConversationExample />
        </div>

        <div className="flex flex-col gap-4">
          <div className="text-base text-[#9D9D9D] space-y-1 font-grotesk leading-relaxed">
            <p>• Hold ⌘C and click on any element on your page</p>
            <p>• Works with Cursor, Claude Code, OpenCode</p>
            <p>• Just a single script tag (it&apos;s just JavaScript!)</p>
          </div>
        </div>

        <a
          href="https://github.com/aidenybai/react-grab#readme"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#FF45A2] text-[#0A0A0A] text-sm font-grotesk border border-[#300417] hover:bg-[#FF5BB0] transition-colors w-fit"
        >
          Install on GitHub
        </a>
      </div>
    </div>
  </div>
);
