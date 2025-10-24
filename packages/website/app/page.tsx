"use client";

import { useEffect, useState } from "react";
import { IconCursor } from "@/components/icon-cursor";

/**
 * Code exported from Paper
 * https://app.paper.design/file/01K8B7DN5Q87ENAZCG11HMYXKQ?node=01K8BFNQRHNWXJET51BPR11G5Z
 * on Oct 25, 2025 at 1:10 AM.
 */
export default function Frame() {
  const [isHolding, setIsHolding] = useState(false);
  const [isActivated, setIsActivated] = useState(false);
  const [isHoveringButton, setIsHoveringButton] = useState(false);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "c") {
        event.preventDefault();
        if (!timeoutId) {
          setIsHolding(true);
          timeoutId = setTimeout(() => {
            setIsActivated(true);
          }, 500);
        }
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (!event.metaKey && !event.ctrlKey) {
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }
        setIsHolding(false);
        setIsActivated(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);
  return (
    <div
      style={{
        alignItems: "flex-start",
        boxSizing: "border-box",
        display: "flex",
        justifyContent: "center",
        minHeight: "100vh",
        width: "100%",
        padding: "80px 20px 20px",
      }}
    >
      <div
        style={{
          alignItems: "start",
          boxSizing: "border-box",
          contain: "layout",
          display: "flex",
          flexDirection: "column",
          gap: "17px",
          height: "fit-content",
          justifyContent: "start",
          overflowWrap: "break-word",
          paddingBlock: 0,
          paddingInline: 0,
          transformOrigin: "0% 0%",
          width: "100%",
          maxWidth: "450px",
        }}
      >
        <div
          style={{
            alignItems: "start",
            boxSizing: "border-box",
            contain: "layout",
            display: "flex",
            flexDirection: "column",
            flexShrink: "0",
            gap: "20px",
            height: "fit-content",
            justifyContent: "start",
            overflowWrap: "break-word",
            paddingBlock: 0,
            paddingInline: 0,
            transformOrigin: "50% 50%",
            width: "fit-content",
          }}
        >
          <div
            style={{
              alignItems: "start",
              boxSizing: "border-box",
              contain: "layout",
              display: "flex",
              flexDirection: "column",
              flexShrink: "0",
              gap: "6px",
              height: "fit-content",
              justifyContent: "end",
              overflowWrap: "break-word",
              paddingBlock: 0,
              paddingInline: 0,
              transformOrigin: "50% 50%",
              width: "fit-content",
            }}
          >
            <div
              style={{
                alignItems: "center",
                boxSizing: "border-box",
                contain: "layout",
                display: "flex",
                flexDirection: "row",
                flexShrink: "0",
                gap: "2px",
                height: "29px",
                justifyContent: "space-between",
                overflowWrap: "break-word",
                paddingBlock: 0,
                paddingInline: 0,
                transformOrigin: "50% 50%",
                width: "fit-content",
              }}
            >
              <div
                style={{
                  backgroundImage:
                    'url("https://workers.paper.design/file-assets/01K8B7DN5Q87ENAZCG11HMYXKQ/01K8BG8C2M5N2229GF1ZS47FGA.svg")',
                  backgroundPosition: "center center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  boxSizing: "border-box",
                  flexShrink: "0",
                  height: "20px",
                  maxHeight: "none",
                  maxWidth: "none",
                  position: "relative",
                  transformOrigin: "50% 50%",
                  width: "20px",
                }}
              />
              <div
                style={{
                  boxSizing: "border-box",
                  color: "#DDDDDD",
                  flexShrink: "0",
                  fontFamily:
                    '"Enduro-Medium", "Enduro Medium", system-ui, sans-serif',
                  fontSize: "19px",
                  fontSynthesis: "none",
                  fontWeight: 500,
                  height: "fit-content",
                  lineHeight: "150%",
                  MozOsxFontSmoothing: "grayscale",
                  transformOrigin: "50% 50%",
                  WebkitFontSmoothing: "antialiased",
                  whiteSpace: "pre",
                  width: "fit-content",
                }}
              >
                React Grab
              </div>
            </div>
            <div
              style={{
                alignItems: "center",
                boxSizing: "border-box",
                contain: "layout",
                display: "flex",
                flexDirection: "row",
                flexShrink: "0",
                gap: 5,
                height: "fit-content",
                justifyContent: "start",
                overflowWrap: "break-word",
                paddingBlock: 0,
                paddingInline: 0,
                transformOrigin: "50% 50%",
                width: "100%",
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  boxSizing: "border-box",
                  color: "#9D9D9D",
                  flexShrink: "0",
                  fontFamily:
                    '"TestDie-Grotesk-VF", "Test Die Grotesk VF", system-ui, sans-serif',
                  fontSize: "14px",
                  fontSynthesis: "none",
                  fontWeight: 400,
                  lineHeight: "150%",
                  MozOsxFontSmoothing: "grayscale",
                  transformOrigin: "50% 50%",
                  WebkitFontSmoothing: "antialiased",
                  whiteSpace: "nowrap",
                  width: "fit-content",
                }}
              >
                Copy elements on your app as context for
              </div>
              <div
                style={{
                  alignItems: "center",
                  boxSizing: "border-box",
                  contain: "layout",
                  display: "flex",
                  flexDirection: "row",
                  flexShrink: "0",
                  gap: "4px",
                  height: "20px",
                  justifyContent: "start",
                  overflowWrap: "break-word",
                  paddingBlock: 0,
                  paddingInline: 0,
                  transformOrigin: "50% 50%",
                  width: "fit-content",
                }}
              >
                <div
                  style={{
                    backgroundImage:
                      'url("https://workers.paper.design/file-assets/01K8B7DN5Q87ENAZCG11HMYXKQ/01K8B8K3PGH6GEC5E8RD0GJ6TE.svg")',
                    backgroundPosition: "center center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    boxSizing: "border-box",
                    flexShrink: "0",
                    height: "10px",
                    maxHeight: "none",
                    maxWidth: "none",
                    opacity: "100%",
                    position: "relative",
                    transformOrigin: "50% 50%",
                    width: "9px",
                  }}
                />
                <div
                  style={{
                    boxSizing: "border-box",
                    color: "#ECECEC",
                    flexShrink: "0",
                    fontFamily:
                      '"TestDie-Grotesk-VF", "Test Die Grotesk VF", system-ui, sans-serif',
                    fontSize: "14px",
                    fontSynthesis: "none",
                    fontWeight: 400,
                    height: "fit-content",
                    lineHeight: "150%",
                    MozOsxFontSmoothing: "grayscale",
                    transformOrigin: "50% 50%",
                    WebkitFontSmoothing: "antialiased",
                    whiteSpace: "pre",
                    width: "fit-content",
                  }}
                >
                  Cursor,
                </div>
              </div>
              <div
                style={{
                  alignItems: "center",
                  boxSizing: "border-box",
                  contain: "layout",
                  display: "flex",
                  flexDirection: "row",
                  flexShrink: "0",
                  gap: "3px",
                  height: "20px",
                  justifyContent: "start",
                  overflowWrap: "break-word",
                  paddingBlock: 0,
                  paddingInline: 0,
                  transformOrigin: "50% 50%",
                  width: "fit-content",
                }}
              >
                <div
                  style={{
                    backgroundImage:
                      'url("https://workers.paper.design/file-assets/01K8B7DN5Q87ENAZCG11HMYXKQ/01K8B93QBHWB9G2Y6G0ZTRV539.svg")',
                    backgroundPosition: "center center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    boxSizing: "border-box",
                    flexShrink: "0",
                    height: "10px",
                    maxHeight: "none",
                    maxWidth: "none",
                    position: "relative",
                    transformOrigin: "50% 50%",
                    width: "10px",
                  }}
                />
                <div
                  style={{
                    boxSizing: "border-box",
                    color: "#ECECEC",
                    flexShrink: "0",
                    fontFamily:
                      '"TestDie-Grotesk-VF", "Test Die Grotesk VF", system-ui, sans-serif',
                    fontSize: "14px",
                    fontSynthesis: "none",
                    fontWeight: 400,
                    height: "fit-content",
                    lineHeight: "150%",
                    MozOsxFontSmoothing: "grayscale",
                    transformOrigin: "50% 50%",
                    WebkitFontSmoothing: "antialiased",
                    whiteSpace: "pre",
                    width: "fit-content",
                  }}
                >
                  Claude,
                </div>
              </div>
              <div
                style={{
                  boxSizing: "border-box",
                  color: "#9D9D9D",
                  flexShrink: "0",
                  fontFamily:
                    '"TestDie-Grotesk-VF", "Test Die Grotesk VF", system-ui, sans-serif',
                  fontSize: "14px",
                  fontSynthesis: "none",
                  fontWeight: 400,
                  height: "20px",
                  lineHeight: "150%",
                  MozOsxFontSmoothing: "grayscale",
                  transformOrigin: "50% 50%",
                  WebkitFontSmoothing: "antialiased",
                  whiteSpace: "pre",
                  width: "fit-content",
                }}
              >
                etc
              </div>
            </div>
          </div>
          <div
            style={{
              alignItems: "start",
              borderColor: "#6F0064",
              borderStyle: "solid",
              borderWidth: "1px",
              boxSizing: "border-box",
              contain: "layout",
              display: "flex",
              flexDirection: "column",
              flexShrink: "0",
              gap: 0,
              height: "fit-content",
              justifyContent: "start",
              overflowWrap: "break-word",
              paddingBlock: "6px",
              paddingInline: "11px",
              transformOrigin: "50% 50%",
              width: "100%",
              maxWidth: "180px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                background: isHolding
                  ? "rgba(143, 0, 119, 0.1)"
                  : "transparent",
                border: isHolding
                  ? "0.3px solid #8F0077"
                  : "0px solid transparent",
                width: isHolding ? "100%" : "0%",
                transition: isHolding
                  ? "width 0.5s linear, border 0s"
                  : "width 0.2s ease-out, border 0s",
              }}
            />
            <div
              style={{
                alignItems: "center",
                boxSizing: "border-box",
                contain: "layout",
                display: "flex",
                flexDirection: "row",
                flexShrink: "0",
                height: "20px",
                justifyContent: "space-between",
                overflowWrap: "break-word",
                paddingBlock: 0,
                paddingInline: 0,
                transformOrigin: "50% 50%",
                width: "100%",
                position: "relative",
              }}
            >
              <div
                style={{
                  boxSizing: "border-box",
                  color: "#FFCDF4",
                  flexShrink: "0",
                  fontFamily:
                    '"TestDie-Grotesk-VF", "Test Die Grotesk VF", system-ui, sans-serif',
                  fontSize: "14px",
                  fontSynthesis: "none",
                  fontWeight: 400,
                  lineHeight: "150%",
                  MozOsxFontSmoothing: "grayscale",
                  transformOrigin: "50% 50%",
                  WebkitFontSmoothing: "antialiased",
                  whiteSpace: "nowrap",
                  width: "55px",
                }}
              >
                {isActivated ? "Click to grab" : "Activate"}
              </div>
              <div
                style={{
                  boxSizing: "border-box",
                  color: "#FF8FEC",
                  flexShrink: "0",
                  fontFamily:
                    '"TestDie-Grotesk-VF", "Test Die Grotesk VF", system-ui, sans-serif',
                  fontSize: "14px",
                  fontSynthesis: "none",
                  fontWeight: 400,
                  lineHeight: "150%",
                  MozOsxFontSmoothing: "grayscale",
                  opacity: 0.99,
                  transformOrigin: "50% 50%",
                  WebkitFontSmoothing: "antialiased",
                  whiteSpace: "nowrap",
                  width: "fit-content",
                }}
              >
                Hold ⌘C
              </div>
            </div>
          </div>
          <div
            style={{
              boxSizing: "border-box",
              color: "#9D9D9D",
              flexShrink: "0",
              fontFamily:
                '"TestDie-Grotesk-VF", "Test Die Grotesk VF", system-ui, sans-serif',
              fontSize: "14px",
              fontSynthesis: "none",
              fontWeight: 400,
              lineHeight: "176%",
              MozOsxFontSmoothing: "grayscale",
              transformOrigin: "50% 50%",
              WebkitFontSmoothing: "antialiased",
              whiteSpace: "pre-wrap",
              width: "100%",
              maxWidth: "402px",
            }}
          >
            By default coding agents cannot access elements on your page. React
            Grab fixes this - just point and click to provide context!
          </div>
        </div>
        <div
          style={{
            alignItems: "start",
            borderColor: "#212121",
            borderStyle: "solid",
            borderWidth: "1px",
            boxSizing: "border-box",
            contain: "layout",
            display: "flex",
            flexDirection: "row",
            flexShrink: "0",
            gap: "clamp(20px, 5vw, 67px)",
            height: "fit-content",
            justifyContent: "center",
            overflowWrap: "break-word",
            paddingBlock: "13px",
            paddingInline: "20px",
            transformOrigin: "50% 50%",
            width: "100%",
            maxWidth: "389px",
          }}
        >
          <div
            style={{
              alignItems: "start",
              boxSizing: "border-box",
              contain: "layout",
              display: "flex",
              flexDirection: "column",
              flexShrink: "0",
              gap: 0,
              height: "fit-content",
              justifyContent: "start",
              overflowWrap: "break-word",
              padding: "42px 0px 0px",
              paddingBottom: "0px",
              paddingLeft: 0,
              paddingRight: 0,
              paddingTop: "42px",
              transformOrigin: "50% 50%",
              width: "fit-content",
            }}
          >
            <div
              style={{
                alignItems: "start",
                boxSizing: "border-box",
                contain: "layout",
                display: "flex",
                flexDirection: "column",
                flexShrink: "0",
                gap: "6px",
                height: "fit-content",
                justifyContent: "center",
                overflowWrap: "break-word",
                paddingBlock: 0,
                paddingInline: 0,
                transformOrigin: "50% 50%",
                width: "fit-content",
              }}
            >
              <div
                style={{
                  boxSizing: "border-box",
                  color: "#9D9D9D",
                  flexShrink: "0",
                  fontFamily:
                    '"EKModenaMono-Regular", "EK Modena Mono", system-ui, sans-serif',
                  fontSize: "11px",
                  fontSynthesis: "none",
                  fontWeight: 400,
                  height: "16px",
                  lineHeight: "171%",
                  MozOsxFontSmoothing: "grayscale",
                  transformOrigin: "50% 50%",
                  WebkitFontSmoothing: "antialiased",
                  whiteSpace: "pre",
                  width: "fit-content",
                }}
              >
                Agent
              </div>
              <div
                style={{
                  alignItems: "start",
                  borderColor: "#2A2A2A",
                  borderStyle: "solid",
                  borderWidth: "0.5px",
                  boxSizing: "border-box",
                  contain: "layout",
                  display: "flex",
                  flexDirection: "column",
                  flexShrink: "0",
                  gap: 0,
                  height: "fit-content",
                  justifyContent: "start",
                  overflowWrap: "break-word",
                  paddingBlock: "4px",
                  paddingInline: "9px",
                  transformOrigin: "50% 50%",
                  width: "fit-content",
                }}
              >
                <div
                  style={{
                    boxSizing: "border-box",
                    color: "#C6C6C6",
                    flexShrink: "0",
                    fontFamily:
                      '"EKModenaMono-Regular", "EK Modena Mono", system-ui, sans-serif',
                    fontSize: "12px",
                    fontSynthesis: "none",
                    fontWeight: 400,
                    height: "20px",
                    lineHeight: "171%",
                    MozOsxFontSmoothing: "grayscale",
                    transformOrigin: "50% 50%",
                    WebkitFontSmoothing: "antialiased",
                    whiteSpace: "pre",
                    width: "fit-content",
                  }}
                >
                  Which one?
                </div>
              </div>
            </div>
          </div>
          <div
            style={{
              alignItems: "end",
              boxSizing: "border-box",
              contain: "layout",
              display: "flex",
              flexDirection: "column",
              flexShrink: "0",
              gap: "6px",
              height: "fit-content",
              justifyContent: "center",
              overflowWrap: "break-word",
              paddingBlock: 0,
              paddingInline: 0,
              transformOrigin: "50% 50%",
              width: "fit-content",
            }}
          >
            <div
              style={{
                boxSizing: "border-box",
                color: "#9D9D9D",
                flexShrink: "0",
                fontFamily:
                  '"EKModenaMono-Regular", "EK Modena Mono", system-ui, sans-serif',
                fontSize: "11px",
                fontSynthesis: "none",
                fontWeight: 400,
                height: "16px",
                lineHeight: "171%",
                MozOsxFontSmoothing: "grayscale",
                transformOrigin: "50% 50%",
                WebkitFontSmoothing: "antialiased",
                whiteSpace: "pre",
                width: "fit-content",
              }}
            >
              You
            </div>
            <div
              style={{
                alignItems: "start",
                backgroundColor: "#181818",
                boxSizing: "border-box",
                contain: "layout",
                display: "flex",
                flexDirection: "column",
                flexShrink: "0",
                gap: 0,
                height: "fit-content",
                justifyContent: "start",
                overflowWrap: "break-word",
                paddingBlock: "4px",
                paddingInline: "9px",
                transformOrigin: "50% 50%",
                width: "fit-content",
              }}
            >
              <div
                style={{
                  boxSizing: "border-box",
                  color: "#C6C6C6",
                  flexShrink: "0",
                  fontFamily:
                    '"EKModenaMono-Regular", "EK Modena Mono", system-ui, sans-serif',
                  fontSize: "12px",
                  fontSynthesis: "none",
                  fontWeight: 400,
                  height: "20px",
                  lineHeight: "171%",
                  MozOsxFontSmoothing: "grayscale",
                  transformOrigin: "50% 50%",
                  WebkitFontSmoothing: "antialiased",
                  whiteSpace: "pre",
                  width: "fit-content",
                }}
              >
                make the button bigger!
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            alignItems: "start",
            boxSizing: "border-box",
            contain: "layout",
            display: "flex",
            flexDirection: "column",
            flexShrink: "0",
            gap: 0,
            height: "fit-content",
            justifyContent: "center",
            overflowWrap: "break-word",
            paddingBlock: 0,
            paddingInline: 0,
            transformOrigin: "50% 50%",
            width: "fit-content",
          }}
        >
          <div
            style={{
              alignItems: "center",
              boxSizing: "border-box",
              contain: "layout",
              display: "flex",
              flexDirection: "row",
              flexShrink: "0",
              gap: 4,
              height: "fit-content",
              justifyContent: "start",
              overflowWrap: "break-word",
              paddingBlock: 0,
              paddingInline: 0,
              transformOrigin: "50% 50%",
              width: "fit-content",
            }}
          >
            <div
              style={{
                boxSizing: "border-box",
                color: "#9D9D9D",
                flexShrink: "0",
                fontFamily:
                  '"TestDie-Grotesk-VF", "Test Die Grotesk VF", system-ui, sans-serif',
                fontSize: "14px",
                fontSynthesis: "none",
                fontWeight: 400,
                height: "20px",
                lineHeight: "150%",
                MozOsxFontSmoothing: "grayscale",
                transformOrigin: "50% 50%",
                WebkitFontSmoothing: "antialiased",
                whiteSpace: "pre",
                width: "fit-content",
              }}
            >
              With
            </div>
            <div
              style={{
                alignItems: "center",
                boxSizing: "border-box",
                contain: "layout",
                display: "flex",
                flexDirection: "row",
                flexShrink: "0",
                gap: "1px",
                height: "fit-content",
                justifyContent: "start",
                overflowWrap: "break-word",
                paddingBlock: 0,
                paddingInline: 0,
                transformOrigin: "50% 50%",
                width: "fit-content",
              }}
            >
              <div
                style={{
                  alignItems: "center",
                  boxSizing: "border-box",
                  contain: "layout",
                  display: "flex",
                  flexDirection: "row",
                  flexShrink: "0",
                  height: "29px",
                  justifyContent: "space-between",
                  overflowWrap: "break-word",
                  paddingBlock: 0,
                  paddingInline: 0,
                  transformOrigin: "50% 50%",
                  width: "fit-content",
                }}
              >
                <div
                  style={{
                    backgroundImage:
                      'url("https://workers.paper.design/file-assets/01K8B7DN5Q87ENAZCG11HMYXKQ/01K8BG8C2M5N2229GF1ZS47FGA.svg")',
                    backgroundPosition: "center center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    boxSizing: "border-box",
                    flexShrink: "0",
                    height: "15px",
                    maxHeight: "none",
                    maxWidth: "none",
                    position: "relative",
                    transformOrigin: "50% 50%",
                    width: "15px",
                  }}
                />
                <div
                  style={{
                    boxSizing: "border-box",
                    color: "#DDDDDD",
                    flexShrink: "0",
                    fontFamily:
                      '"Enduro-Medium", "Enduro Medium", system-ui, sans-serif',
                    fontSize: "13.5px",
                    fontSynthesis: "none",
                    fontWeight: 500,
                    height: "fit-content",
                    lineHeight: "150%",
                    MozOsxFontSmoothing: "grayscale",
                    transformOrigin: "50% 50%",
                    WebkitFontSmoothing: "antialiased",
                    whiteSpace: "pre",
                    width: "fit-content",
                  }}
                >
                  React Grab
                </div>
              </div>
              <div
                style={{
                  boxSizing: "border-box",
                  color: "#9D9D9D",
                  flexShrink: "0",
                  fontFamily:
                    '"TestDie-Grotesk-VF", "Test Die Grotesk VF", system-ui, sans-serif',
                  fontSize: "14px",
                  fontSynthesis: "none",
                  fontWeight: 400,
                  height: "20px",
                  lineHeight: "150%",
                  MozOsxFontSmoothing: "grayscale",
                  transformOrigin: "50% 50%",
                  WebkitFontSmoothing: "antialiased",
                  whiteSpace: "pre",
                  width: "fit-content",
                }}
              >
                :
              </div>
            </div>
          </div>
          <div
            style={{
              boxSizing: "border-box",
              color: "#9D9D9D",
              flexShrink: "0",
              fontFamily:
                '"TestDie-Grotesk-VF", "Test Die Grotesk VF", system-ui, sans-serif',
              fontSize: "14px",
              fontSynthesis: "none",
              fontWeight: 400,
              lineHeight: "176%",
              MozOsxFontSmoothing: "grayscale",
              transformOrigin: "50% 50%",
              WebkitFontSmoothing: "antialiased",
              whiteSpace: "pre-wrap",
              width: "100%",
            }}
          >
            {
              "• Hold ⌘C and click to grab the element \n• Use with any tool you want: Cursor, Claude Code, OpenCode\n• Just a single script tag (it's just JavaScript!)"
            }
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "10px",
            alignItems: "center",
            marginTop: "20px",
          }}
        >
          <a
            href="https://github.com/aidenybai/react-grab"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none", cursor: "pointer" }}
          >
            <div
              onMouseEnter={() => setIsHoveringButton(true)}
              onMouseLeave={() => setIsHoveringButton(false)}
              style={{
                alignItems: "center",
                backgroundColor: isHoveringButton ? "#C9C9C9" : "#DDDDDD",
                boxSizing: "border-box",
                contain: "layout",
                display: "flex",
                flexDirection: "row",
                gap: "3px",
                height: "fit-content",
                justifyContent: "start",
                overflowWrap: "break-word",
                paddingBlock: "4px",
                paddingInline: "10px",
                transformOrigin: "0% 0%",
                width: "fit-content",
                cursor: "pointer",
                transition: "background-color 0.2s ease",
              }}
            >
              <div
                style={{
                  backgroundImage:
                    'url("https://workers.paper.design/file-assets/01K8B7DN5Q87ENAZCG11HMYXKQ/01K8BGT50758JY4WNS5DBMC8Y7.svg")',
                  backgroundPosition: "center center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  boxSizing: "border-box",
                  flexShrink: "0",
                  height: "12px",
                  maxHeight: "none",
                  maxWidth: "none",
                  position: "relative",
                  transformOrigin: "50% 50%",
                  width: "12px",
                }}
              />
              <div
                style={{
                  boxSizing: "border-box",
                  color: "#090909",
                  flexShrink: "0",
                  fontFamily:
                    '"TestDie-Grotesk-VF", "Test Die Grotesk VF", system-ui, sans-serif',
                  fontSize: "13px",
                  fontSynthesis: "none",
                  fontWeight: 400,
                  lineHeight: "176%",
                  MozOsxFontSmoothing: "grayscale",
                  transformOrigin: "50% 50%",
                  WebkitFontSmoothing: "antialiased",
                  whiteSpace: "pre",
                  width: "fit-content",
                }}
              >
                View on GitHub
              </div>
            </div>
          </a>
          <a
            href="https://cursor.com/link/prompt?text=1.+Search+in+this+codebase+for+the+project%0A2.+Determine+if+the+project+is+using+Next.js+app%2Fpages+router%2C+or+Vite%2C+or+something+else%0A3.+Scrape%3A+https%3A%2F%2Fraw.githubusercontent.com%2Faidenybai%2Freact-grab%2Frefs%2Fheads%2Fmain%2FREADME.md%0A4.+Find+the+installation+instructions+in+the+scraped+content+and+install+it+in+the+user%27s+project%0A"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none", cursor: "pointer" }}
          >
            <div
              onMouseEnter={() => setIsHoveringButton(true)}
              onMouseLeave={() => setIsHoveringButton(false)}
              style={{
                alignItems: "center",
                backgroundColor: isHoveringButton
                  ? "rgba(221, 221, 221, 0.1)"
                  : "transparent",
                borderColor: isHoveringButton ? "#C9C9C9" : "#9D9D9D",
                borderStyle: "solid",
                borderWidth: "1px",
                boxSizing: "border-box",
                contain: "layout",
                display: "flex",
                flexDirection: "row",
                gap: "3px",
                height: "fit-content",
                justifyContent: "start",
                overflowWrap: "break-word",
                paddingBlock: "4px",
                paddingInline: "10px",
                transformOrigin: "0% 0%",
                width: "fit-content",
                cursor: "pointer",
                transition:
                  "background-color 0.2s ease, border-color 0.2s ease",
              }}
            >
              <IconCursor width={12} height={12} />
              <div
                style={{
                  boxSizing: "border-box",
                  color: "#DDDDDD",
                  flexShrink: "0",
                  fontFamily:
                    '"TestDie-Grotesk-VF", "Test Die Grotesk VF", system-ui, sans-serif',
                  fontSize: "13px",
                  fontSynthesis: "none",
                  fontWeight: 400,
                  lineHeight: "176%",
                  MozOsxFontSmoothing: "grayscale",
                  transformOrigin: "50% 50%",
                  WebkitFontSmoothing: "antialiased",
                  whiteSpace: "pre",
                  width: "fit-content",
                }}
              >
                Install using Cursor
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
