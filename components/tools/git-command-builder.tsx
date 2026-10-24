"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "../copy-button";

type Scenario = {
  id: string;
  label: string;
  destructive?: boolean;
  options?: { key: string; label: string; placeholder?: string; defaultValue?: string }[];
  build: (opts: Record<string, string>) => { command: string; explanation: string };
};

const SCENARIOS: Scenario[] = [
  {
    id: "undo-keep",
    label: "Undo last commit, keep changes",
    options: [{ key: "n", label: "Commits back", placeholder: "1", defaultValue: "1" }],
    build: (o) => ({
      command: `git reset --soft HEAD~${o.n || "1"}`,
      explanation: "Moves the branch pointer back but leaves your working tree and index untouched, so the undone commit's changes stay staged and ready to re-commit.",
    }),
  },
  {
    id: "undo-discard",
    label: "Undo last commit, discard changes",
    destructive: true,
    options: [{ key: "n", label: "Commits back", placeholder: "1", defaultValue: "1" }],
    build: (o) => ({
      command: `git reset --hard HEAD~${o.n || "1"}`,
      explanation: "Moves the branch pointer back and throws away the commit's changes from the working tree. Uncommitted work is lost too — this cannot be undone except via the reflog.",
    }),
  },
  {
    id: "rebase",
    label: "Interactive rebase (squash / reorder)",
    options: [{ key: "n", label: "Commits back", placeholder: "3", defaultValue: "3" }],
    build: (o) => ({
      command: `git rebase -i HEAD~${o.n || "3"}`,
      explanation: "Opens an editor listing the last commits. Change 'pick' to 'squash' to fold a commit into the one above it, or reorder lines to reorder history. Only rebase commits you have not pushed yet.",
    }),
  },
  {
    id: "stash-save",
    label: "Stash current changes",
    options: [{ key: "msg", label: "Stash message", placeholder: "wip: before refactor", defaultValue: "" }],
    build: (o) => ({
      command: o.msg ? `git stash push -m "${o.msg}"` : "git stash push",
      explanation: "Shelves uncommitted changes so you can switch branches or pull with a clean tree, then restore them later with stash apply or pop.",
    }),
  },
  {
    id: "stash-apply",
    label: "Restore stashed changes (keep stash)",
    build: () => ({
      command: "git stash apply",
      explanation: "Re-applies the most recent stash without deleting it, so you can re-apply it again elsewhere. Use 'git stash list' to see all stashes.",
    }),
  },
  {
    id: "stash-pop",
    label: "Restore stashed changes (drop stash)",
    build: () => ({
      command: "git stash pop",
      explanation: "Re-applies the most recent stash and deletes it from the list. If it conflicts, the stash is kept so you can resolve and retry.",
    }),
  },
  {
    id: "cherry-pick",
    label: "Cherry-pick a commit",
    options: [{ key: "sha", label: "Commit hash", placeholder: "abc1234", defaultValue: "" }],
    build: (o) => ({
      command: `git cherry-pick ${o.sha || "<commit-hash>"}`,
      explanation: "Copies one commit's changes onto your current branch as a new commit, leaving the original branch untouched.",
    }),
  },
  {
    id: "amend",
    label: "Amend the last commit",
    options: [{ key: "msg", label: "New message (leave blank to keep it)", placeholder: "", defaultValue: "" }],
    build: (o) => ({
      command: o.msg ? `git commit --amend -m "${o.msg}"` : "git commit --amend --no-edit",
      explanation: "Folds staged changes into the previous commit instead of creating a new one. Only amend commits you have not pushed — amending rewrites history.",
    }),
  },
  {
    id: "discard-file",
    label: "Discard changes to one file",
    destructive: true,
    options: [{ key: "file", label: "File path", placeholder: "src/app.ts", defaultValue: "" }],
    build: (o) => ({
      command: `git restore ${o.file || "<file>"}`,
      explanation: "Reverts one file to its last committed state. This destroys uncommitted edits to that file — use it only when you are sure you don't need them.",
    }),
  },
  {
    id: "recover-branch",
    label: "Recover a deleted branch",
    options: [{ key: "sha", label: "Commit hash from reflog", placeholder: "abc1234", defaultValue: "" }],
    build: (o) => ({
      command: o.sha && o.sha !== "<commit-hash>" ? `git branch recovered-branch ${o.sha}` : "git reflog",
      explanation: o.sha
        ? "Recreates a branch pointing at the commit the deleted branch used to point to. Find that hash first with 'git reflog' if you don't have it."
        : "First run 'git reflog' to find the commit hash the deleted branch pointed to, then re-run this scenario with that hash to recreate the branch.",
    }),
  },
];

export function GitCommandBuilder() {
  const [scenarioId, setScenarioId] = useState(SCENARIOS[0].id);
  const [opts, setOpts] = useState<Record<string, string>>({ n: "1" });

  const scenario = SCENARIOS.find((s) => s.id === scenarioId) ?? SCENARIOS[0];
  const result = useMemo(() => scenario.build(opts), [scenario, opts]);

  const selectScenario = (id: string) => {
    setScenarioId(id);
    const next = SCENARIOS.find((s) => s.id === id);
    const defaults: Record<string, string> = {};
    next?.options?.forEach((o) => {
      defaults[o.key] = o.defaultValue ?? "";
    });
    setOpts(defaults);
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-2 sm:grid-cols-2">
        {SCENARIOS.map((s) => (
          <button
            key={s.id}
            onClick={() => selectScenario(s.id)}
            className={`rounded-xl border px-4 py-3 text-left font-mono text-xs leading-relaxed transition-all ${
              scenario.id === s.id
                ? "border-blue-500/40 bg-blue-500/10 text-blue-200"
                : "border-zinc-800 bg-[#121316] text-zinc-300 hover:border-zinc-600"
            }`}
          >
            {s.label}
            {s.destructive && <span className="ml-2 text-rose-400">destructive</span>}
          </button>
        ))}
      </div>

      {scenario.options && scenario.options.length > 0 && (
        <div className="flex flex-wrap items-end gap-4">
          {scenario.options.map((o) => (
            <label key={o.key} className="flex flex-col gap-1.5 font-mono text-xs text-zinc-400">
              {o.label}
              <input
                value={opts[o.key] ?? ""}
                onChange={(e) => setOpts((prev) => ({ ...prev, [o.key]: e.target.value }))}
                placeholder={o.placeholder}
                className="w-64 rounded-lg border border-zinc-800 bg-[#121316] px-3 py-2 font-mono text-xs text-zinc-200 outline-none focus:border-blue-500/40"
              />
            </label>
          ))}
        </div>
      )}

      {scenario.destructive && (
        <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 font-mono text-xs leading-relaxed text-rose-300">
          Warning: this command destroys uncommitted work. Commit or stash anything you want to keep first.
        </p>
      )}

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs uppercase tracking-wider text-zinc-400">Command</span>
          <CopyButton value={result.command} />
        </div>
        <pre className="overflow-auto whitespace-pre-wrap rounded-xl border border-zinc-800 bg-[#121316] p-4 font-mono text-sm leading-relaxed text-blue-300">
          {result.command}
        </pre>
        <p className="text-sm leading-relaxed text-zinc-400">{result.explanation}</p>
      </div>
    </div>
  );
}
