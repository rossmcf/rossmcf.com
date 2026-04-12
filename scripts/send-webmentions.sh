#!/bin/bash
# Trigger brid.gy to syndicate a post to Mastodon and/or Bluesky.
#
# Usage:
#   ./scripts/send-webmentions.sh https://www.rossmcf.com/blog/my-post/
#   ./scripts/send-webmentions.sh https://www.rossmcf.com/micro/2026/04/12/my-note/
#
# Run this after a new post is live on the site. brid.gy will fetch the post,
# read the u-syndicate-to links, and publish to each configured network.
# Each post URL is only syndicated once — re-running is safe.
#
# Prerequisites:
#   - You must have signed in at https://brid.gy with your domain first.
#   - Your mastodon/bluesky params must be set in config.toml.

set -euo pipefail

if [ -z "${1:-}" ]; then
  echo "Usage: $0 <post-url>"
  echo "Example: $0 https://www.rossmcf.com/blog/my-post/"
  exit 1
fi

POST_URL="$1"
BRIDGY_ENDPOINT="https://brid.gy/publish/webmention"

echo "Sending webmentions for: $POST_URL"

send() {
  local network="$1"
  local target="https://brid.gy/publish/${network}"
  local status
  status=$(curl -s -o /dev/null -w "%{http_code}" \
    --data-urlencode "source=${POST_URL}" \
    --data-urlencode "target=${target}" \
    "${BRIDGY_ENDPOINT}")
  echo "  ${network}: HTTP ${status}"
}

send mastodon
send bluesky

echo ""
echo "Done. Check https://brid.gy for syndication status and to retrieve the syndicated URLs."
echo "Once you have them, add to the post's frontmatter:"
echo '  syndication = ["https://mastodon.social/...", "https://bsky.app/..."]'
