# Pantolingo

**Instantly translate your entire website into 41 languages—without touching your code.**

---

## The Problem

Expanding globally means serving customers in their native language. But traditional localization is painful:

- **Separate codebases** for each language version
- **Manual translation workflows** that slow down releases
- **Expensive agencies** charging per word, per language
- **Sync nightmares** when your source content changes
- **Engineering overhead** to deploy and maintain multiple sites

What if you could skip all of that?

---

## The Solution

Pantolingo is a **translation proxy** that sits between your visitors and your website. Point a subdomain to us, and we handle everything else.

```
Your site:     example.com (English)
Spanish:       es.example.com → Pantolingo → example.com
French:        fr.example.com → Pantolingo → example.com
German:        de.example.com → Pantolingo → example.com
```

When a visitor requests `es.example.com/products`, Pantolingo:

1. Fetches the page from your original site
2. Translates the content using AI
3. Caches translations for instant repeat visits
4. Returns fully translated HTML with rewritten links

**Zero code changes. Zero deployments. Zero maintenance.**

---

## Key Features

### AI-Powered Translation
Powered by Claude, one of the world's most capable AI models. Get natural, context-aware translations—not robotic word-for-word output.

### Smart Caching
Every translation is cached. The first visitor pays the translation cost; everyone after gets instant responses. Your translation database grows automatically.

### Human Review Dashboard
AI does the heavy lifting, but you stay in control. Review, edit, and approve translations through an intuitive web interface. Mark translations as reviewed for QA tracking.

### URL Path Translation
Translate not just content, but URLs too. `/products/blue-widget` becomes `/productos/widget-azul` in Spanish—better for SEO and user experience.

### Preserves Your Design
Formatting, links, images, and styling come through perfectly. We use a sophisticated placeholder system to maintain inline elements during translation.

### SEO Ready
Automatic `lang` attributes and `hreflang` tags. Search engines see proper multilingual markup without any extra work from you.

### Analytics Built In
Track page views by language and path. See which content resonates in which markets.

---

## 41 Languages Supported

| Americas | Europe | Asia & Middle East |
|----------|--------|-------------------|
| English | French | Chinese (Simplified) |
| Spanish (Mexico) | German | Chinese (Traditional) |
| Spanish (Spain) | Italian | Japanese |
| Portuguese (Brazil) | Dutch | Korean |
| Portuguese (Portugal) | Polish | Hindi |
| French (Canada) | Swedish | Arabic |
| | Norwegian | Hebrew |
| | Danish | Thai |
| | Finnish | Vietnamese |
| | Czech | Indonesian |
| | Greek | Malay |
| | Romanian | Turkish |
| | Hungarian | Farsi |
| | Ukrainian | Urdu |
| | Russian | Bengali |

*Full RTL (right-to-left) support for Arabic, Hebrew, Farsi, and Urdu.*

---

## How It Works

### 1. Configure Your Domains
Point your language subdomains to Pantolingo. Set up takes minutes.

### 2. We Handle Translation
First visit to any page triggers AI translation. Content is parsed, translated, and cached automatically.

### 3. Review & Refine
Use the dashboard to review translations, make edits, and ensure quality. Your changes are saved permanently.

### 4. Serve Global Visitors
Cached translations load instantly. Your site now speaks 41 languages.

---

## Why Pantolingo?

| Traditional Localization | Pantolingo |
|-------------------------|------------|
| Weeks to launch new languages | Minutes |
| Per-word translation fees | Flat infrastructure cost |
| Manual sync when content changes | Automatic |
| Separate deployments per language | Single source of truth |
| Developer time for each update | Zero engineering overhead |
| Stale translations | Always current |

---

## Use Cases

### E-Commerce
Serve international customers in their native language. Translated product pages, checkout flows, and support content—all from your single existing store.

### SaaS Products
Expand your addressable market without maintaining localized app versions. Documentation, marketing pages, and dashboards translated automatically.

### Content Publishers
Reach global audiences without managing multilingual content teams. Articles, blogs, and media sites translated on demand.

### Marketing Sites
Launch campaigns in new markets overnight. Landing pages, feature pages, and conversion funnels in any language.

---

## Getting Started

1. **Sign up** at pantolingo.com
2. **Add your website** and configure target languages
3. **Point DNS** for your language subdomains
4. **Go live**—translations begin automatically

---

## Technical Highlights

- **No code integration required**—works with any website technology
- **Preserves cookies, sessions, and authentication**—user state flows through seamlessly
- **Static assets optimized**—images, CSS, and JS proxy directly with caching
- **Deferred processing**—translations cached after response, keeping pages fast
- **Hash-based deduplication**—identical text translated once, reused everywhere

---

## Ready to Go Global?

Stop maintaining separate sites for each language. Stop waiting weeks for translations. Stop paying per word.

**Pantolingo: Your website, every language, zero effort.**

[Get Started →](https://pantolingo.com)
