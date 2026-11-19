import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";

const source = readFileSync(new URL("../docs/redirect.js", import.meta.url), "utf8");
const vault = "ef6ca3e3b524d22f";
const uid = "lantern-mist-lagoon-glacier-a11727f29082";

function visit(hash) {
  const nodes = Object.fromEntries(["status", "detail", "open-link"].map(id => [id, {
    textContent: "", hidden: true, href: ""
  }]));
  const opened = [];
  runInNewContext(source, {
    URLSearchParams,
    document: { getElementById: id => nodes[id] },
    window: { location: { hash, assign: value => opened.push(value) } }
  });
  return { nodes, opened };
}

test("opens exactly the targeted vault ID and opaque note UID", () => {
  const result = visit(`#vault=${vault}&uid=${uid}`);
  const expected = `obsidian://advanced-uri?vault=${vault}&uid=${uid}`;
  assert.deepEqual(result.opened, [expected]);
  assert.equal(result.nodes["open-link"].href, expected);
  assert.equal(result.nodes["open-link"].hidden, false);
});

for (const [label, hash] of [
  ["missing vault", `#uid=${uid}`],
  ["named vault", `#vault=studio&uid=${uid}`],
  ["duplicate UID", `#vault=${vault}&uid=${uid}&uid=other-id`],
  ["extra command", `#vault=${vault}&uid=${uid}&commandid=workspace%3Aclose`],
  ["extra write option", `#vault=${vault}&uid=${uid}&data=test`],
  ["encoded ampersand in UID", `#vault=${vault}&uid=test%26commandid%3Dclose`],
  ["path-like UID", `#vault=${vault}&uid=private%2Ffolder%2Fnote`],
  ["empty fragment", ""]
]) {
  test(`rejects ${label}`, () => {
    const result = visit(hash);
    assert.deepEqual(result.opened, []);
    assert.equal(result.nodes["open-link"].hidden, true);
  });
}
