# 22 אותיות, מערכת חיה

**[לאפליקציה החיה: https://alef-beit-gh.vercel.app/](https://alef-beit-gh.vercel.app/)**

המיזוג האחרון, בלי Vercel: https://raw.githack.com/Anat1969/ALEF-BEIT-GH/main/build/index.html

חקירה רב-ממדית של האלף-בית העברי: מרחב, אנרגיה, קול ואדריכלות. כל אות היא כרטיס שלם עם שבעה מימדים, מיומנות יומית, קשרים ומאמר.

גיבוי ב-GitHub Pages: https://anat1969.github.io/ALEF-BEIT-GH/

## הרצה
```
npm install
npm run dev        # פיתוח
npm run build      # בנייה ל-dist, כולל מניפסט תמונות
npm run preview    # תצוגה מקדימה של הבנייה
```

## מבנה
- `src/App.jsx` סרגל עליון, ניווט לשוניות, מצב בכתובת, כפתור הלוגו A&I.
- `src/components/` מסך לכל לשונית: בית, לוח בקרה, אות בודדת, גלריה, הסדר, קשרים, פואטיקה, סדר יום.
- `src/data/letterPower.js` הכוח של כל אות בשני כיוונים, הקריאה בשבת קד, שיר ופוסט.
- `src/data/sequence.js` הסדר: המסע, המדרגות וסימני הסדר.
- `src/data/letterKnowledge.js` ידע, הבנה ויישום לכל אות, עם מקורות ורמת ודאות.
- `src/data/systems.js` חמש שיטות קשר מחושבות (א״ת ב״ש, מספר קטן, מוצא בפה, ספר יצירה, צורות סופיות).
- `src/data/letters.json` האפיון המקורי: מימדים חושיים, מיומנויות ומודל מרחבי.
- `public/letter-images/` תמונות האותיות. `scripts/build-image-manifest.mjs` בונה מהן מניפסט.
- `public/manifest.webmanifest`, `public/sw.js`, `public/icon*.png` התקנה מ-Chrome.
- `tests/smoke.mjs` בדיקת Playwright לפני מסירה (`VERCEL=1 npm run build` ואז `VERCEL=1 npx vite preview`).

## החלטות
- אתר סטטי בלי בסיס נתונים. בחירות משתמש נשמרות ב-localStorage.
- כל פעולות העריכה והפיתוח בתוך כפתור הלוגו (`<ai-menu>`), לפי https://github.com/Anat1969/AppOfApp-GH/blob/main/docs/ai-menu-standard.md
- service worker: דפים מהרשת, נכסים ותמונות מהמטמון.
