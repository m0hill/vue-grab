import { LogoText } from "./logo-text";
import { ToolBadge } from "./tool-badge";
import { IconCursor } from "./icon-cursor";
import { IconClaude } from "./icon-claude";
import { ActivateTab } from "./activate-tab";
import { ConversationExample } from "./conversation-example";

export const HeroSection = () => (
  <div className="relative min-h-screen w-full overflow-hidden px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
    <div className="mx-auto max-w-4xl">
      <div className="flex flex-col gap-8 lg:gap-12">
        <div className="flex flex-col gap-4">
          <LogoText size="lg" />

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 flex-wrap">
            <p className="text-base text-[#9D9D9D] font-grotesk leading-[150%]">
              Copy elements on your app & as context for
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <ToolBadge
                icon={
                  <IconCursor
                    width={10}
                    height={10}
                    className="text-[#ECECEC]"
                  />
                }
                label="Cursor,"
              />
              <ToolBadge
                icon={
                  <IconClaude
                    width={10}
                    height={10}
                    className="text-[#ECECEC]"
                  />
                }
                label="Claude,"
                gap="gap-[3px]"
              />
              <p className="text-base text-[#9D9D9D] font-grotesk leading-[150%]">
                etc
              </p>
            </div>
          </div>
        </div>

        <ActivateTab />

        <div className="flex flex-col gap-6">
          <p className="text-base text-[#9D9D9D] max-w-[402px] font-grotesk leading-[176%]">
            Previously, it was hard to pinpoint exactly what element you were
            talking about. Context switching made it hard to make pinpoint
            changes to your site:
          </p>

          <ConversationExample />
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <p className="text-base text-[#9D9D9D] font-grotesk leading-[150%]">
              With
            </p>
            <LogoText size="base" />
          </div>

          <div className="text-base text-[#9D9D9D] space-y-1 font-grotesk leading-[176%]">
            <p>• Hold ⌘C and click to grab the element</p>
            <p>• Use with any tool you want: Cursor, Claude Code, OpenCode</p>
            <p>• Just a single script tag (it&apos;s just JavaScript!)</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);
