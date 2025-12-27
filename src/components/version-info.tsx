"use client";

import { useEffect } from "react";

export function VersionInfo() {
  useEffect(() => {
    const version = process.env.NEXT_PUBLIC_APP_VERSION || "unknown";
    const buildTime = process.env.NEXT_PUBLIC_BUILD_TIME || "unknown";
    const gitCommit = process.env.NEXT_PUBLIC_GIT_COMMIT || "unknown";
    const environment = process.env.NODE_ENV;

    // Log version info to console on app load
    console.log(
      `%c QRe8 by CHANGA.tech %c v${version} %c`,
      "background: #0f172a; color: #3b82f6; padding: 4px 8px; border-radius: 4px 0 0 4px; font-weight: bold;",
      "background: #3b82f6; color: white; padding: 4px 8px; border-radius: 0 4px 4px 0;",
      ""
    );
    console.log(`Build: ${buildTime}`);
    console.log(`Commit: ${gitCommit}`);
    console.log(`Environment: ${environment}`);

    // Keyboard shortcut: Ctrl+Shift+V (or Cmd+Shift+V on Mac) to show version
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "V") {
        e.preventDefault();
        alert(
          `QRe8 by CHANGA.tech\n\n` +
          `Version: ${version}\n` +
          `Build: ${new Date(buildTime).toLocaleString()}\n` +
          `Commit: ${gitCommit}\n` +
          `Environment: ${environment}`
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Hidden element in footer for inspecting via DevTools
  return (
    <div
      id="app-version"
      data-version={process.env.NEXT_PUBLIC_APP_VERSION}
      data-build={process.env.NEXT_PUBLIC_BUILD_TIME}
      data-commit={process.env.NEXT_PUBLIC_GIT_COMMIT}
      style={{ display: "none" }}
      aria-hidden="true"
    />
  );
}
