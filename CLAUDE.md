# CLAUDE.md

## A&I logo button
The top bar holds only the app name (links home), content navigation, and ONE logo button "אד' ענת שטיבלמן A&I" (`<ai-menu>` from https://appofapp-gh.vercel.app/ai-menu.js). Every editing and development action (העתקת קישור, שיחת הפיתוח, פרויקט המחקר, התקנת האפליקציה, edit mode, add, delete) lives only inside it, never as loose buttons. Standard: https://github.com/Anat1969/AppOfApp-GH/blob/main/docs/ai-menu-standard.md

## בעלות ולוגו
אפליקציה של ענת (לא של עיריית אשדוד). כפתור הלוגו: `<ai-menu>` רגיל, בלי `brand="ashdod"`.

## סקיל הבנייה
עובדים לפי `.claude/skills/anat-app-builder/SKILL.md`. לפני כל שינוי קוראים אותו ואת הקובץ הזה.
- **תיקון של ענת (2026-10-27):** "שדרוג לפי הסקיל" כולל תמיד את השדרוג החזותי, ולא רק תשתית. לפני מסירה עוברים סעיף אחר סעיף על סעיפים 4 ו-5 בסקיל (דף בית אמיתי עם חזון, מטרה, כלים ותוצאות, עומק ותלת־ממד, לוח צבעים עם שמות, כותרות גדולות ודקות), ומשווים צילום מסך לפני ואחרי. אם השינוי לא נראה בעין, השדרוג לא הסתיים.

## מבנה
- `app/` אפליקציית Vite ו-React. נתונים ב-`app/src/data/letters.json`, תמונות ב-`app/public/letter-images/`.
- כרטיס האות: `app/src/components/LetterCard.jsx` (מסגרת וניווט), וכל מקטע בקובץ משלו ב-`app/src/components/letter/`. קבועים משותפים ב-`letter/constants.js`.
- מצב התצוגה נשמר בכתובת (`#dashboard`, `#letter/5`, `#workflow`), ולכן "העתקת קישור" משתפת בדיוק את המסך הנוכחי.
- דף הבית `#home` (`app/src/components/Home.jsx`): טבעת תלת־ממד של 22 האותיות, חזון, מטרה ושיטה, שישה כלים, תוצאות שנספרות מהנתונים, ומפת תוכן לפי גימטריה (אחדות, עשרות, מאות). הוא מחליף את מסך הפתיחה הישן.
- מצבי צבע (זהב, כחול, שחור-לבן, לבן-שחור) נמצאים בתוך כפתור הלוגו (`menu.items`), לא בסרגל.
- לוח צבעים עם שמות ב-`index.css`: לילה, לילה עמוק, זהב, זהב שחר, אבן, אבן דהויה. שאר האסימונים מפנים אליו.
- מזהי האותיות הם ערכי הגימטריה (1 עד 10, 20 עד 90, 100 עד 400). מעבר קודמת והבאה הולך לפי הסדר ברשימה, לא לפי מזהה פלוס אחד.
- התקנה מ-Chrome: `public/manifest.webmanifest`, `public/sw.js`, אייקונים מ-`public/icon.svg` דרך `node scripts/build-icons.mjs`.
- פריסה: Vercel מ-main, פרויקט `alef-beit-gh` (Root Directory: `app`). כתובת ראשית: https://alef-beit-gh.vercel.app/
- גיבוי: GitHub Pages מ-main (`.github/workflows/deploy.yml`) כגיבוי: https://anat1969.github.io/ALEF-BEIT-GH/
- `base` ב-vite.config.js: `/` ב-Vercel (משתנה `VERCEL`), `/ALEF-BEIT-GH/` ב-GitHub Pages.

## בדיקה לפני מסירה
```
cd app && npm run build && npx vite preview --port 4173 &
NODE_PATH=$(npm root -g) node tests/smoke.mjs
```
בודק: לוגו A&I בסרגל ואין כפתורים חופשיים, כל לשונית מעדכנת כתובת, שמירה אחרי רענון, כפתורים מרובעים, התקנה (`getInstallabilityErrors` ריק), נייד בלי גלילה אופקית, הפחתת תנועה.

## יומן תיקונים
- 2026-10-27: שדרוג לפי anat-app-builder. סרגל עליון גם בדף הפתיחה, שם האפליקציה ואייקון מקשרים לדף הבית, מצבי צבע עברו לכפתור הלוגו, גופני IBM Plex Sans Hebrew ו-Mono, כפתורים מרובעים עם הרמה ושקיעה, הפחתת תנועה, אייקון אפליקציה בלי טקסט, manifest ו-service worker, מצב בכתובת, שמירת סדר היום ותצוגת לוח הבקרה, הלשונית "Workflow" הפכה ל"סדר יום".

- 2026-10-27: lint נקי, פיצול LetterCard.jsx לקובץ לכל מקטע, פריסה ל-Vercel, בדיקה שעוברת על כל מקטעי כרטיס האות.

- 2026-10-27: דף בית אמיתי, לוח צבעים עם שמות, כותרות דקות ועומק בכרטיסים. תוקן באג ישן: אחרי י' הכפתור "הבאה" הוביל לאות שלא קיימת, ו"הקודמת" מא' לא עבדה.

## למדנו בבנייה
- סרגל זכוכית שקוף מדי נותן לתוכן הגלול להיראות דרכו. לסרגלים דביקים: רקע אטום כמעט (`.glass.bar`).
- `ai-menu` הוא Custom Element: ב-React מעבירים `items` דרך ref, לא כ-prop.
- ב-Playwright, שינוי שעובר דרך useEffect דורש המתנה קצרה לפני הבדיקה.
- פרויקט Vercel שנוצר דרך ה-API לא נפרס עד הדחיפה הבאה. את הפריסה הראשונה מפעילים ב-create_deployment עם gitSource על main.
- מהסביבה הזו vercel.app כן נגיש, ולכן בדיקת smoke רצה גם מול האתר החי (`BASE=https://alef-beit-gh.vercel.app/`).
- לא נותנים שם מחלקה שמתנגש עם Tailwind (`ring`, `shadow`, `border`): `.ring` צייר מסגרת לבנה באמצע הטבעת. משתמשים בשמות כמו `letter-ring`.
- ריווח אותיות רחב שובר מילים בעברית. בתוויות עבריות: עד 0.06em.
- איפוס מצב כשמחליפים אות: `key={letter.id}` על הרכיב, לא setState בתוך useEffect.
