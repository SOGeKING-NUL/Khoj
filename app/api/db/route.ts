import sql from '../../db/db';

export async function GET() {
  await sql`
    CREATE TABLE IF NOT EXISTS reel_metadata (
      shortcode TEXT PRIMARY KEY,
      url TEXT,
      caption TEXT,
      comments TEXT[],
      hashtags TEXT[],
      thumbnail TEXT,
      video_url TEXT,
      metadata JSONB,
      created_at TIMESTAMPTZ DEFAULT now()
    );
  `;

  return Response.json({ ok: true });
}
