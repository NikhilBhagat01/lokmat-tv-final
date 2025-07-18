import { Translate } from '@google-cloud/translate/build/src/v2';
import slugify from 'slugify';
import { db } from '../lib/db.js';

const translate = new Translate({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

export async function detectAndTranslate(video) {
  const targetLanguage = 'en';
  const { id: video_id, title } = video;

  if (!video_id || !title) {
    console.warn('Missing video_id or title. Skipping translation.');
    return null;
  }

  if (!video_id.startsWith('x') && !video_id.startsWith('X')) {
    console.log(`Skipping private video ${video_id}`);
    return null;
  }

  try {
    // 1. Check if video already exists
    const [rows] = await db.execute('SELECT *  FROM dm_videos WHERE video_id = ? LIMIT 1', [
      video_id,
    ]);

    // console.log(rows);
    if (rows.length > 0) {
      // console.log(rows[0]);
      // console.log(`Video ${video_id} already exists in database. Skipping.`);
      const slug = rows[0].slug;
      return slug;
    }

    // 2. Translate title
    const [translation] = await translate.translate(title, targetLanguage);

    // 3. Slugify translation
    const slugifiedText = await generateUniqueSlug(translation);

    // 4. Insert into DB
    await db.execute(
      `INSERT INTO dm_videos (
        video_id, original_title, slug, translation
      ) VALUES (?, ?, ?, ?)`,
      [video_id, title, slugifiedText, translation]
    );

    console.log(`Inserted video ${video_id} with slug: ${slugifiedText}`);
    return slugifiedText;
  } catch (err) {
    console.error('ERROR in detectAndTranslate:', err);
    throw err;
  }
}

async function generateUniqueSlug(title) {
  const baseSlug = slugify(title, { lower: true, strict: true, remove: /[*+~.()'"!:@]/g });
  let slug = baseSlug;
  let count = 1;

  // Check if slug exists
  while (true) {
    const [rows] = await db.query('SELECT 1 FROM dm_videos WHERE slug = ?', [slug]);
    if (rows.length === 0) break; // slug is unique

    slug = `${baseSlug}-${count}`;
    count++;
  }

  return slug;
}
