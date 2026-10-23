# Vault

Optional. Use this file only if you keep a separate store of personal or client data outside this brain. Delete it if you do not.

Its purpose is to tell the agent what exists in the vault and when to look there, so the brain does not duplicate records that already live elsewhere.

## Location

- Vault root: <ABSOLUTE PATH>
- Access: <READ-ONLY / READ-WRITE>
- Version control: <GIT / NONE>

## Map

| Area | Path | Contents |
|---|---|---|
| <AREA> | <PATH INSIDE VAULT> | <WHAT IS THERE> |

## Routing rules

- When the user asks about <TOPIC>, read <PATH>.
- Summarise and point. Do not copy vault records into this brain.
- Never read or print the contents of the secrets directory. Reference the path only.

## Hard rules

- <WHETHER GIT WRITES ARE ALLOWED, AND WHEN>
- <ANYTHING THE AGENT MUST NOT MODIFY IN THE VAULT>

## Known inconsistencies

- <DUPLICATES, STALE PATHS, OR CONFLICTING RECORDS THE AGENT SHOULD KNOW ABOUT>
