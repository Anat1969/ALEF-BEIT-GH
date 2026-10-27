# 22 אותיות, מערכת חיה

חקירה רב-ממדית של האלף-בית העברי: מרחב, אנרגיה, קול ואדריכלות. כל אות היא כרטיס שלם עם שבעה מימדים, מיומנות יומית, קשרים ומאמר.

כתובת: https://alef-beit-gh.vercel.app/

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
- `src/components/` מסך לכל לשונית: לוח בקרה, אות בודדת, גלריה, קשרים, מטריצה, סדר יום.
- `src/data/letters.json` מקור הנתונים היחיד של האותיות.
- `public/letter-images/` תמונות האותיות. `scripts/build-image-manifest.mjs` בונה מהן מניפסט.
- `public/manifest.webmanifest`, `public/sw.js`, `public/icon*.png` התקנה מ-Chrome.
- `tests/smoke.mjs` בדיקת Playwright לפני מסירה.

## החלטות
- אתר סטטי בלי בסיס נתונים. בחירות משתמש נשמרות ב-localStorage.
- כל פעולות העריכה והפיתוח בתוך כפתור הלוגו (`<ai-menu>`), לפי https://github.com/Anat1969/AppOfApp-GH/blob/main/docs/ai-menu-standard.md
- service worker: דפים מהרשת, נכסים ותמונות מהמטמון.
