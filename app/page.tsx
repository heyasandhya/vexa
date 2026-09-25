"use client";

import { HoleBackground } from "@/components/animate-ui/components/backgrounds/hole";
import { BlueTitle, GrayTitle } from "@/components/Reusables";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PLACEHOLDERS, SUGGESTIONS } from "@/lib/data";

import { SignInButton, useAuth } from "@clerk/nextjs";
import { cn } from "cn";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [prompt, setPrompt] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (isFocused || prompt) return;

    const t = setInterval(() => {
      setPlaceholderIndex(
        (i) => (i + 1) % PLACEHOLDERS.length
      );
    }, 3000);

    return () => clearInterval(t);
  }, [isFocused, prompt]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 200) + "px";
  }, [prompt]);

  const handleSubmit = () => {
    if (!prompt.trim() || !isSignedIn) return;
    router.push(`/workspace?prompt=${encodeURIComponent(prompt.trim())}`);
  };


  //submit on Enter, allow shift+Enter for newlines
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSuggestion = (s: string) => {
    setPrompt(s);
    textareaRef.current?.focus();
  };


  return <main className="min-h-screen bg-[#0a0a0a] selection:bg-white/20">
    <section className="relative flex flex-col items-center overflow-hidden px-4 pb-24 pt-40 text-center">

      <HoleBackground
        strokeColor="rgba(255,255,255,0.05)"
        className="pointer-events-none absolute inset-0 h-full w-full"
        style={{
          maskImage:
            "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.5) 50%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.5) 50%, transparent 100%)",
        }}
      />
      <Badge variant={"outline"} className="gap-2 p-4 backdrop-blur-sm">
        <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> Powered by Gemini 3.5 Flash
      </Badge>

      <h1 className="mx-auto max-w-3xl text-balance font-serif text-5xl leading-tight tracking-tight sm:text-5xl lg:text-7xl z-10">
        <GrayTitle>Build your dream with Vexa</GrayTitle>
        <br />
        <BlueTitle>using a single prompt</BlueTitle>
      </h1>

      <p className="mx-auto mt-6 max-w-xl text-balance text-base leading-relaxed text-white/40 z-10">
        Tell Vexa what you want to build. It writes the code, chooses the packages, and delivers a live preview—all from a single prompt. Less setup, more building.
      </p>
      {/*Prompt box */}
      <div className="relative z-10 mx-auto mt-12 w-full max-w-2xl">
        <div className={cn(
          "rounded-2xl border bg-[#111111] duration-200",
          isFocused
            ? "border-white/20 ring-1 ring-white/8"
            : "border-white/8",
        )}
        >
          <textarea ref={textareaRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            rows={1}
            className="w-full resize-none bg-transparent px-5 pb-4 pt-5 text-sm placeholder:text-white/20 focus:outline-none sm:text-base"
            style={{ minHeight: 56, maxHeight: 200 }}
            placeholder={PLACEHOLDERS[placeholderIndex]}
          />

          <div className="flex items-center justify-between border-t border-white/6 px-4 py-2.5">
            <span className="text-xs text-white/20">
              Press ↵ to generate · Shift+↵ for new line
            </span>

            {isSignedIn ? (
              <Button
                onClick={handleSubmit}
                disabled={!prompt.trim()}
                className="h-8 rounded-full bg-white px-5 font-semibold text-black hover:bg-white/90"
                variant={prompt.trim() ? "default" : "secondary"}
              >
                Generate
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            ) : (
              <SignInButton mode="modal">
                <Button className="h-8 rounded-full bg-white px-5 font-semibold text-black hover:bg-white/90">
                  Generate
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </SignInButton>
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => handleSuggestion(s)}
              className="rounded-full border border-white/8 bg-white/4 px-3 py-1.5 text-xs text-white/40 hover:border-white/15 hover:bg-white/8 hover:text-white/70"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-10 text-xs text-white/20">No credits card required . 10 free generations on sign up</p>
    </section>

    <section className="relative mx-auto w-full max-w-6xl px-4 pb-24 pt-8">
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d0d] shadow-2xl">
        {/* Browser Chrome */}
        <div className="flex h-12 items-center gap-4 border-b border-white/10 bg-[#151515] px-4">
          <div className="flex gap-2">
            <span className="h-3 w-3 rounded-full bg-red-400/80" />
            <span className="h-3 w-3 rounded-full bg-yellow-400/80" />
            <span className="h-3 w-3 rounded-full bg-green-400/80" />
          </div>

          <div className="flex h-7 flex-1 items-center rounded-md border border-white/5 bg-white/5 px-3 text-xs text-white/30">
            vexa.ai/workspace
          </div>
        </div>

        {/* Workspace */}
        <div className="grid min-h-130 grid-cols-1 md:grid-cols-2">
          {/* Chat Panel */}
          <div className="flex flex-col border-b border-white/10 bg-[#101010] md:border-b-0 md:border-r">
            <div className="border-b border-white/8 px-5 py-4">
              <span className="text-sm font-medium text-white/80">
                Vexa Assistant
              </span>
              <p className="mt-1 text-xs text-white/30">
                Build your app with a prompt
              </p>
            </div>

            <div className="flex flex-1 flex-col gap-4 p-5">
              {/* User message */}
              <div className="ml-auto max-w-[80%] rounded-2xl rounded-br-md bg-blue-800 px-4 py-3 text-sm text-white/70">
                Build a task management dashboard with a dark theme.
              </div>

              {/* AI response */}
              <div className="max-w-[85%] rounded-2xl rounded-bl-md border border-white/8 bg-white/3 px-4 py-3 text-sm leading-relaxed text-white/50">
                I'll create a clean task management dashboard with Todo,
                In Progress, and Done columns.
              </div>

              {/* AI response */}
              <div className="max-w-[85%] rounded-2xl rounded-bl-md border border-white/8 bg-white/3 px-4 py-3 text-sm text-white/50">
                Setting up the workspace and generating the components...
              </div>

              {/* Typing indicator */}
              <div className="flex items-center gap-1 px-2">
                <span className="h-1.5 w-1.5 rounded-full bg-white/30" />
                <span className="h-1.5 w-1.5 rounded-full bg-white/30" />
                <span className="h-1.5 w-1.5 rounded-full bg-white/30" />
              </div>
            </div>

            {/* Message input */}
            <div className="m-4 rounded-xl border border-white/8 bg-white/3 px-4 py-3 text-sm text-white/20">
              Ask Vexa to make changes...
            </div>
          </div>

          {/* Preview Panel */}
          <div className="bg-[#0b0b0b]">
            {/* Tabs */}
            <div className="flex items-center gap-6 border-b border-white/8 px-5">
              <div className="border-b-3 border-blue-800 py-4 text-xs font-medium text-white">
                Preview
              </div>
              <div className="py-4 text-xs text-white/30">Code</div>
            </div>

            {/* Kanban */}
            <div className="p-5">
              <div className="mb-5">
                <h3 className="text-lg font-medium text-white/80">
                  My Tasks
                </h3>
                <p className="mt-1 text-xs text-white/30">
                  Manage your projects and tasks
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {/* Todo */}
                <div className="rounded-xl border border-white/8 bg-white/2 p-3">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-medium text-white/50">
                      Todo
                    </span>
                    <span className="text-[10px] text-white/20">3</span>
                  </div>

                  <div className="space-y-2">
                    <div className="h-20 rounded-lg border border-white/6 bg-white/3 p-3">
                      <div className="h-2 w-16 rounded bg-white/10" />
                      <div className="mt-3 h-2 w-24 rounded bg-white/5" />
                    </div>

                    <div className="h-16 rounded-lg border border-white/6 bg-white/3" />
                  </div>
                </div>

                {/* In Progress */}
                <div className="rounded-xl border border-white/8 bg-white/2 p-3">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-medium text-white/50">
                      In Progress
                    </span>
                    <span className="text-[10px] text-white/20">2</span>
                  </div>

                  <div className="space-y-2">
                    <div className="h-24 rounded-lg border border-white/6 bg-white/3 p-3">
                      <div className="h-2 w-20 rounded bg-white/10" />
                      <div className="mt-3 h-2 w-28 rounded bg-white/5" />
                      <div className="mt-2 h-2 w-16 rounded bg-white/5" />
                    </div>
                  </div>
                </div>

                {/* Done */}
                <div className="rounded-xl border border-white/8 bg-white/2 p-3">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-medium text-white/50">
                      Done
                    </span>
                    <span className="text-[10px] text-white/20">4</span>
                  </div>

                  <div className="space-y-2">
                    <div className="h-16 rounded-lg border border-white/6 bg-white/3" />

                    <div className="h-20 rounded-lg border border-white/6 bg-white/3 p-3">
                      <div className="h-2 w-14 rounded bg-white/10" />
                      <div className="mt-3 h-2 w-20 rounded bg-white/5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>



}
