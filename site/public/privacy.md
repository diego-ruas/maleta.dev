# Privacy Policy — Maleta.dev

Last updated: September 2026.

## The install scripts collect nothing

`install.ps1` and `install.sh` are one-way: they download files and write them into the local configuration directories of Claude Code and Codex. Nothing is sent back to Maleta.dev. No telemetry, no install identifier, no usage report. The scripts do not read API keys, do not read session history, and do not upload any file from your disk. Before overwriting an existing configuration they create a local `.pre-install.bak` backup.

## What the site collects

The site uses Vercel Analytics to measure traffic volume and popular pages. The measurement is aggregate and cookieless: no individual profile, no cross-site tracking, no raw IP retention by the product. Selections made in the command builder — presets, ticked skills, community imports — are processed in your browser and never sent to a server of ours; the generated command exists only in the open page.

## Third-party services

Community skill search queries the public GitHub API directly from your browser. GitHub therefore receives your IP address and user-agent header, as with any site visit; that data is handled under GitHub's privacy policy, not ours. The install scripts also download files from `raw.githubusercontent.com`. No other third-party service receives your data from this site.

## Cookies

The site sets no tracking or advertising cookies. Interface preferences, where they exist, stay in your browser's local storage and are never transmitted.

## Your rights and contact

Because there is no account, registration or personal database, there is no profile of yours to access, correct or delete. For questions about data handling, content removal requests, or formal clarification, write to diegodruas@proton.me.
