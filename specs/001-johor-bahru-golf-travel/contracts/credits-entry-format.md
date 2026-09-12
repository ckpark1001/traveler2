# Contract: CREDITS.md Entry Format

Every file under `assets/images/` MUST have exactly one corresponding entry in `CREDITS.md`,
recorded before the image is considered usable (Constitution Principle VIII; research.md §15).

## Required entry fields

| Field | Description |
|---|---|
| File path | Relative path of the image file, e.g. `assets/images/horizon-hills/horizon-hills-01.webp` |
| Author | Photographer or rights holder name as credited at the source |
| Source URL | The original detail/source page the image was found and verified on (not a raw file URL) |
| License | The specific reuse license/terms confirmed on that source page (e.g. "Unsplash License", "Pexels License", "CC0", "CC BY 4.0 — attribution required") |
| Verified date | ISO date (`YYYY-MM-DD`) the author/license/reuse terms were checked, in `Asia/Seoul` calendar terms is not required — just an ISO date |

## Suggested table format

```markdown
| File | Author | Source URL | License | Verified |
|---|---|---|---|---|
| assets/images/hero/hero-01.webp | Jane Doe | https://example.com/photos/123 | Unsplash License | 2026-09-20 |
```

## Rules

- One row per file — if an image is re-encoded (e.g. `.jpg` → `.webp`), the row describes the
  final shipped file's path, but Author/Source URL/License/Verified must still trace back to
  the original the pixels came from.
- No row may reference a placeholder, a stock icon, or an unverified source.
- A row MUST exist before its image file is referenced from `index.html`; do not ship an image
  whose license could not be confirmed.
- If a license requires visible attribution beyond `CREDITS.md` (e.g. some CC BY variants),
  note that in the License column so implementation tasks can add on-page attribution as
  needed.
