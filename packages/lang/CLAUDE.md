# Language Package (`packages/lang`)

Shared language metadata and utilities.

## Features

-   41 supported languages with localized display names
-   Flag emoji generation from country codes
-   RTL language detection (Arabic, Hebrew, Farsi, Urdu)
-   Country-language mappings

## Language Code Format

Uses **lowercase BCP 47 regional codes** (e.g., `es-mx`, `pt-br`) with `Intl.DisplayNames` for localized names.

## Modules

-   `index.ts`: Exports all language utilities
-   `data.ts`: Static language data (41 supported languages)
-   `info.ts`: Intl.DisplayNames-based language info
-   `lookup.ts`: Country/language mappings, RTL detection

## Usage

```typescript
import { getLanguageInfo, isRtlLanguage, SUPPORTED_LANGUAGES } from '@pantolingo/lang'
```

## Notes

This package is not deployed separately - it's bundled into each app at build time.
