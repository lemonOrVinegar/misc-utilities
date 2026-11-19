// Static, navigation-only Studio link resolver.
// Only the URL fragment is read; no network calls, storage, dependencies, or analytics.
(() => {
  "use strict";
  const status = document.getElementById("status");
  const detail = document.getElementById("detail");
  const action = document.getElementById("open-link");

  const fragment = window.location.hash.slice(1);
  const params = new URLSearchParams(fragment);
  const keys = [...params.keys()].sort();
  const vault = params.get("vault") || "";
  const uid = params.get("uid") || "";

  // Never accept unrecognized options: Advanced URI also supports file writes and commands.
  // Obsidian's appId is 16 hexadecimal characters. UIDs are non-sensitive opaque slugs.
  const valid =
    keys.length === 2 &&
    keys[0] === "uid" &&
    keys[1] === "vault" &&
    /^[a-f0-9]{16}$/i.test(vault) &&
    uid.length >= 8 &&
    uid.length <= 100 &&
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(uid);

  if (!valid) {
    status.textContent = "This Studio link is incomplete or invalid.";
    detail.textContent = "A valid link needs only a vault ID and a note UID.";
    return;
  }

  const target = "obsidian://advanced-uri?vault=" +
    encodeURIComponent(vault) + "&uid=" + encodeURIComponent(uid);
  action.href = target;
  action.hidden = false;
  status.textContent = "Opening your Studio note…";
  detail.textContent = "If Obsidian doesn't open automatically, use the button.";

  // The button is a fallback for browsers that block automatic app launches.
  window.location.assign(target);
})();
