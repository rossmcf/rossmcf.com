#!/usr/bin/env python3
"""
Add an item to the wishlist from the macOS share sheet.
Called by a Shortcuts shortcut — reads URL from stdin, prompts for other fields.
"""

import subprocess
import sys
import os

WISHLIST = os.path.expanduser(
    "~/src/github.com/rossmcf/rossmcf.com/content/fixed/wishlist.md"
)


def ask(prompt, default="", cancel_label="Cancel", ok_label="OK"):
    """Show an osascript dialog. Returns the input string, or None if cancelled."""
    script = (
        f'display dialog {_qs(prompt)} default answer {_qs(default)} '
        f'buttons {{{_qs(cancel_label)}, {_qs(ok_label)}}} default button {_qs(ok_label)}'
    )
    result = subprocess.run(
        ["osascript", "-e", script, "-e", "return text returned of result"],
        capture_output=True, text=True,
    )
    if result.returncode != 0:
        return None
    return result.stdout.strip()


def notify(message):
    subprocess.run([
        "osascript", "-e",
        f'display notification {_qs(message)} with title "Wishlist"',
    ])


def _qs(s):
    """Quote a string for AppleScript."""
    return '"' + s.replace("\\", "\\\\").replace('"', '\\"') + '"'


def main():
    url = sys.stdin.read().strip()
    if not url:
        sys.exit(1)

    title = ask("Title:")
    if title is None:
        sys.exit(0)
    if not title:
        notify("Cancelled — title is required.")
        sys.exit(1)

    size = ask("Size (optional — leave blank to skip):", cancel_label="Skip")
    if size is None:
        size = ""

    price_str = ask("Price in £ (numbers only, 0 if unknown):", default="0")
    if price_str is None:
        sys.exit(0)
    try:
        price = int(price_str)
    except ValueError:
        price = 0

    note = ask("Note (optional — leave blank to skip):", cancel_label="Skip")
    if note is None:
        note = ""

    # Build the TOML block
    lines = ["", "[[params.items]]", f'title = "{title}"']
    if size:
        lines.append(f'size = "{size}"')
    lines.append(f"price = {price}")
    if note:
        lines.append(f'note = "{note}"')
    lines.append(f'url = "{url}"')
    block = "\n".join(lines)

    with open(WISHLIST) as f:
        content = f.read()

    idx = content.rfind("\n+++")
    if idx == -1:
        notify("Error — could not find closing +++ in wishlist.md")
        sys.exit(1)

    new_content = content[:idx] + block + content[idx:]

    with open(WISHLIST, "w") as f:
        f.write(new_content)

    notify(f"Added: {title}")


if __name__ == "__main__":
    main()
