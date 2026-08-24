# 🚀 Panduan Lengkap Konfigurasi Google SEO & Indexing — LeadFlow CRM (Malaysia RM Edition)

> Dokumen ini menerangkan arkitektur SEO teknikal, senarai kata kunci sasaran, konfigurasi pelayan Vercel, dan langkah pengesahan **Google Search Console** untuk **LeadFlow CRM** (`https://myleads-flow.vercel.app/`).

---

## 🎯 1. Objektif & Kata Kunci Carian (Target Keywords)

Sistem ini dioptimumkan untuk menguasai carian Google di pasaran Malaysia bagi kata kunci berikut:

| Kategori | Kata Kunci Sasaran (Search Queries) | Niat Pengguna (Intent) |
| :--- | :--- | :--- |
| **Utama (Brand & Core)** | `CRM Malaysia`, `Sistem CRM Malaysia`, `LeadFlow CRM` | Mencari sistem pengurusan pelanggan tempatan |
| **WhatsApp Sales** | `WhatsApp CRM Malaysia`, `Sistem Jualan WhatsApp`, `WhatsApp Closing Tool` | Mencari automasi dan skrip jualan WhatsApp |
| **Iklan Digital** | `CRM Meta Ads`, `TikTok Ads CRM Malaysia`, `Sistem Pengurusan Prospek Iklan` | Agensi & perniagaan yang mengurus prospek iklan |
| **Invois & Sebut Harga** | `Quotation Invoice Generator CRM`, `Sistem Sebut Harga Ringgit Malaysia (RM)` | Mencari sistem yang boleh jana sebut harga & invois rasmi |
| **PKS & Pasukan Jualan** | `Software CRM Murah Malaysia`, `B2B Sales Pipeline Malaysia`, `Sistem Follow-Up Prospek` | PKS dan jurujual yang mahukan alat closing pantas |

---

## 🧱 2. Arkitektur & Komponen Fail SEO

Sistem ini menggunakan pendekatan **Full-Spectrum SEO**:

```text
leadflow-crm/
├── index.html                   # Meta tags, OpenGraph, Twitter Cards, Schema JSON-LD & Semantic noscript
├── vercel.json                  # Konfigurasi Vercel, pengecualian rewrite SPA, Content-Type headers
└── public/
    ├── robots.txt               # Arahan Googlebot & pautan peta laman rasmi
    ├── sitemap.xml              # Peta laman XML bersama metadata imej resolusi tinggi
    ├── site.webmanifest         # PWA Manifest & carian peranti mudah alih
    ├── og-image.png             # Kad pratonton sosial 1200x630 (WhatsApp, Facebook, Twitter)
    ├── og-image.svg             # Format vektor untuk pratonton tajam
    ├── brand-logo.png           # Logo rasmi untuk Google Knowledge Graph / Rich Snippets
    ├── brand-logo.svg           # Logo vektor jenama
    ├── favicon.svg              # Ikon vektor asas
    ├── favicon-48x48.png        # Ikon standard minimum Google (Gandaan 48px)
    ├── favicon-96x96.png        # Ikon resolusi sederhana (Desktop SERP)
    ├── favicon-192x192.png      # Ikon Android / Chrome PWA
    ├── favicon-512x512.png      # Ikon resolusi tinggi Google Discover
    ├── apple-touch-icon.png     # Ikon 180x180 px iOS & Safari
    └── googlee7e80d636d6f56dd.html # Fail pengesahan pemilikan Google Search Console
```

---

## ⚙️ 3. Konfigurasi Khusus Pelayan Vercel (`vercel.json`)

Bagi aplikasi berasaskan **Single Page Application (SPA)** seperti Vite + React, laluan routing biasa akan mengarahkan semua fail kepada `index.html`. Ini boleh menyebabkan Googlebot menerima fail HTML semasa meminta `sitemap.xml` (menyebabkan ralat *"Couldn't fetch"*).

Konfigurasi dalam `vercel.json` telah dibina khusus untuk mengelakkan ralat ini:

```json
{
  "cleanUrls": false,
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/((?!.*\\..*).*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/sitemap.xml",
      "headers": [
        {
          "key": "Content-Type",
          "value": "application/xml; charset=utf-8"
        },
        {
          "key": "Cache-Control",
          "value": "public, max-age=3600, must-revalidate"
        }
      ]
    },
    {
      "source": "/robots.txt",
      "headers": [
        {
          "key": "Content-Type",
          "value": "text/plain; charset=utf-8"
        },
        {
          "key": "Cache-Control",
          "value": "public, max-age=3600, must-revalidate"
        }
      ]
    }
  ]
}
```

---

## 📊 4. Schema.org JSON-LD Structured Data (Google Rich Snippets)

Dalam `index.html`, 3 schema utama telah dipasang:

1. **`WebApplication` / `SoftwareApplication`**:
   * Memberitahu Google bahawa aplikasi ini adalah perisian perniagaan (`BusinessApplication`) berasaskan web dengan harga RM 0 (Percuma untuk demo POC).
   * Menyenaraikan senarai ciri (*featureList*) seperti 1-Click WhatsApp, Kanban Pipeline, BANT qualification, dan A4 Quotation/Invoice.
2. **`FAQPage`**:
   * Menyediakan 5 set soalan lazim (FAQ) dalam Bahasa Melayu. Google boleh menukar data ini menjadi *Rich Accordion Dropdown* di halaman pertama carian.
3. **`Organization`**:
   * Menghubungkan logo jenama (`brand-logo.png`), nombor WhatsApp pembangun, dan kawasan perkhidmatan (`MY - Malaysia`).

---

## 📝 5. Langkah Setup & Semakan di Google Search Console

### Langkah 1: Tambah Property
1. Buka **[Google Search Console](https://search.google.com/search-console)**.
2. Klik **Add property** > Pilih **URL prefix**.
3. Masukkan: `https://myleads-flow.vercel.app/`.

### Langkah 2: Pengesahan Pemilikan (Verification)
* Pilih kaedah **HTML file**. Fail `public/googlee7e80d636d6f56dd.html` telah sedia ada dalam build anda. Klik **Verify**.

### Langkah 3: Hantar Peta Laman (Submit Sitemap)
1. Di menu sebelah kiri, klik **Sitemaps**.
2. Di ruangan *Add a new sitemap*, taip:
   ```text
   sitemap.xml
   ```
3. Klik **SUBMIT**. Status akan menunjukkan **Success** (warna hijau).

### Langkah 4: Meminta Googlebot Merayap Segera (Request Indexing)
1. Taip `https://myleads-flow.vercel.app/` pada bar carian atas (*Inspect any URL*).
2. Klik butang **Request Indexing**.

---

## 🖼️ 6. Garis Panduan Kemunculan Logo di Hasil Carian Google

Untuk memastikan logo anda dipaparkan di sebelah nama laman web pada carian Google:

1. **Format Ikon (Gandaan 48px)**:
   * Googlebot-Image memerlukan ikon nisbah 1:1 gandaan 48px (`48x48`, `96x96`, `192x192`, `512x512`). Fail-fail ini telah diletakkan di dalam folder `public/`.
2. **Kestabilan URL Ikon**:
   * URL ikon tidak boleh ditukar berulang kali agar cache Googlebot kekal stabil.
3. **Masa Kemunculan**:
   * Google Search biasanya mengindeks teks dalam masa **24–72 jam**.
   * Favicon/Logo biasanya diselaraskan oleh bot imej Google dalam masa **3–7 hari** selepas pengindeksan pertama.

---

## 🔄 7. Prosedur Menukar Custom Domain (Jika Berpindah Domain)

Jika anda menyambungkan custom domain sendiri pada masa hadapan (cth: `https://leadflow.my/`):
1. Kemas kini URL di dalam:
   * `public/sitemap.xml` (`<loc>` dan `<image:loc>`)
   * `public/robots.txt` (`Host` dan `Sitemap`)
   * `index.html` (`canonical`, `og:url`, `og:image`, `twitter:url`, dan `JSON-LD Schema`)
2. Commit & push ke GitHub.
3. Tambah domain baru tersebut di Google Search Console dan hantar semula `sitemap.xml`.
