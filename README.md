# Khoj
Plan trips from Instagram Reels in minutes.

**Transform Instagram reels into personalized travel maps and smart itineraries.**

---

## Project Overview

**Khoj** is an intelligent travel planning application that extracts location data from Instagram reels and posts to automatically build personalized travel itineraries. Users can share reels of places they'd like to visit, and the system will identify exact locations, map them geographically, and generate optimized trip plans.

### Problem Statement

Travel inspiration comes from social media (Instagram reels), but users face:
- **No easy way to save locations** from reels they watch
- **Manual work** to identify exact places mentioned in captions/comments
- **Scattered information** across multiple saved reels
- **No automatic itinerary generation** from saved places

### Solution

Khoj automatically:
1. **Scrapes Instagram reel metadata** (caption, comments, video, tagged location)
2. **Extracts location data** using AI (LLM + Computer Vision)
3. **Geocodes places** to exact coordinates on Google Maps
4. **Stores places** in a personal map collection
5. **Generates optimized itineraries** when planning trips to regions

---

## Core Use Case Flow

```
User watches reel: "Hidden cafe in Majnu ka Tilla! 🥟"
         ↓
User pastes reel URL in Khoj
         ↓
Khoj extracts: "Dolma House, Majnu ka Tilla, Delhi"
         ↓
Shows on map: 📍 28.7155°N, 77.2144°E
         ↓
User saves to "Delhi Trip 2026" collection
         ↓
Later: User clicks "Plan 3-day Delhi trip"
         ↓
Khoj generates optimized itinerary with routes
```

---

## Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn/ui
- **Maps**: Google Maps JavaScript API
- **State Management**: Zustand / React Context
- **Deployment**: Vercel

### Backend
- **Runtime**: Node.js (Serverless functions on Vercel)
- **API Routes**: Next.js API Routes
- **File Processing**: FFmpeg (video frame extraction)

### Database
- **Primary DB**: NeonDB (PostgreSQL 16 with PostGIS)
- **ORM**: Drizzle ORM / Prisma
- **Geospatial**: PostGIS extension
- **Why NeonDB**: 
  - 3GB free tier (vs Supabase 500MB)
  - Serverless with auto-pause (cost savings)
  - Native PostGIS support for location queries

### Authentication
- **Provider**: Clerk
- **Method**: Instagram OAuth (Social Login)
- **Why Clerk**:
  - Built-in Instagram OAuth support
  - 10,000 free monthly active users
  - Pre-built UI components
  - User management dashboard

### External APIs & Services

#### 1. Instagram Scraping - Apify
- **Actor**: `pratikdani/instagram-reels-scraper`
- **Purpose**: Extract reel metadata (caption, video URL, comments, tagged users)
- **Input**: Single reel URL
- **Output**: Complete JSON with 10+ fields
- **Pricing**: ~$0.25 per reel scrape (~$250/month for 1000 reels)

#### 2. Location Extraction - OpenRouter
- **Model**: Google Gemini Flash 1.5 (primary)
- **Fallbacks**: Claude Haiku, GPT-4o-mini
- **Purpose**: Analyze caption + comments → extract location search queries
- **Pricing**: FREE (Gemini Flash) or $0.075 per 1M tokens
- **Why OpenRouter**: 
  - Access multiple LLMs with one API
  - Auto-routing to cheapest available model
  - Built-in fallbacks

#### 3. Geocoding - Google Places API
- **Endpoint**: Text Search API
- **Purpose**: Convert "Connaught Place Delhi" → lat/lng coordinates
- **Pricing**: $32 per 1000 requests (covered by $200/month Google Cloud credit)
- **Free Alternative**: Nominatim (OpenStreetMap) - used as first attempt

#### 4. Visual Analysis - Google Cloud Vision API
- **Feature**: Landmark Detection
- **Purpose**: Fallback when text analysis fails - analyze video frames
- **Usage**: ~10% of reels (only when needed)
- **Pricing**: $1.50 per 1000 images

#### 5. Maps Display - Google Maps JavaScript API
- **Features**: Map embedding, markers, circles, polylines
- **Pricing**: FREE for <28,000 map loads/month
- **Alternative**: Mapbox GL JS (100k free loads/month)

---

## System Architecture

### High-Level Flow

```
Instagram Reel URL
       ↓
[Next.js API Route: /api/scrape-reel]
       ↓
1. Hash Check (NeonDB) → Already processed?
   ├─ YES → Return cached place
   └─ NO → Continue
       ↓
2. Apify Scraper (pratikdani/instagram-reels-scraper)
   → Returns: caption, comments, video_url, thumbnail, etc.
       ↓
3. LLM Analysis (OpenRouter + Gemini Flash)
   Input: caption + top 10 comments + user location context
   Output: {
     "search_query": "Majnu ka Tilla Tibetan Colony, Delhi",
     "confidence": "high",
     "specificity": "area"
   }
       ↓
4. Geocoding Pipeline:
   ├─ Try Nominatim (free) first
   ├─ If confidence < 70% → Google Places API
   └─ Returns: { lat, lng, place_id, formatted_address }
       ↓
5. IF still no location → Visual Analysis
   ├─ Extract 5-8 video frames (FFmpeg)
   ├─ Google Vision API → Detect landmarks
   └─ Returns: landmark name + coordinates
       ↓
6. Store in NeonDB (PostgreSQL + PostGIS)
   INSERT INTO places (name, location, confidence, source)
   VALUES ('Dolma House', ST_Point(77.2144, 28.7155), 'high', 'llm+places_api')
       ↓
7. Return to Frontend
   Display on Google Maps with marker/circle based on confidence
```

### Confidence-Based Display Logic

| Confidence | Specificity | Map Display | Icon |
|-----------|-------------|-------------|------|
| **High** | Exact place | Red pin 📍 | `pin-red.svg` |
| **Medium** | Area/neighborhood | Blue circle 🔵 (500m radius) | `circle-blue` |
| **Low** | City-level | Yellow pin ❓ | `pin-yellow-question.svg` |

---
