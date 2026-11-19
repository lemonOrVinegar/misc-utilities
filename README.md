# Miscellaneous utilities

Small, independent utilities. The first is a **Studio Obsidian link bridge**.

## Studio Obsidian link bridge

A static GitHub Pages site in [`docs/`](docs/). It turns a normal HTTPS link into a **navigation-only** `obsidian://advanced-uri` link using the [Advanced URI Obsidian plugin](https://github.com/Vinzent03/obsidian-advanced-uri). It is not a proxy into the vault, does not read note contents, and cannot access the private Studio repository.

Example format (replace both example values):

```text
https://lemonOrVinegar.github.io/misc-utilities/#vault=ef6ca3e3b524d22f&uid=example-note-unique-id
```

- `vault`: the **16-character Obsidian vault ID**, *not* its name. Use Obsidian's vault switcher to copy it.
- `uid`: the unique, stable, opaque `id` from the note's YAML frontmatter.
- The page accepts **only** these two values. No filename, folder, command, write, search/replace or other Advanced URI options are accepted.
- It automatically attempts to open Obsidian and shows a fallback button in case the browser blocks the app launch.
- It has no build step, packages, third-party scripts, cookies, storage, analytics, server code, or database.

### Publish

After reviewing and merging the change:

1. In this repository's **Settings → Pages**, choose **Deploy from a branch**.
2. Select **`main`** and **`/docs`**, then Save.
3. Use `https://lemonOrVinegar.github.io/misc-utilities/` with the fragment shown above.

GitHub Pages must actually be enabled and published before using the site. The fallback only works if the Advanced URI plugin is installed and enabled in the target Obsidian vault, with its UID field set to `id`.

### Privacy / trust boundaries

- The fragment after `#` is **not sent in an ordinary HTTP request to GitHub Pages**. It is interpreted in JavaScript in the browser.
- The page itself contains **no Studio paths, note IDs, or a lookup table**. Neither the page nor its repository reads from Studio.
- The URL (including its fragment) is **still visible** to ChatGPT, the browser/address bar/history, any extensions, and anyone you send it to. These IDs are identifiers, not access credentials.
- Hosting logs can still record the page visit, IP address and user agent; the GitHub Pages domain reveals the `lemonOrVinegar` GitHub account.
- GitHub hosts the HTML/JavaScript, so the browser trusts GitHub to serve the reviewed code. This is not a cryptographic protection against a modified deployment.
- Advanced URI can perform powerful actions from other specially crafted URLs. **Only this bridge's generated links** are restricted to navigation; do not assume arbitrary `obsidian://` links are safe.

### Local checks

```bash
node --test tests/redirect.test.mjs
```

No `npm install` needed. Test the deployed link from ChatGPT on each intended browser/device; automatic launching is subject to browser behavior.
