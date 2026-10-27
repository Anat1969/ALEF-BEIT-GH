# CLAUDE.md

## A&I logo button
The top bar holds only the app name (links home), content navigation, and ONE logo button "אד' ענת שטיבלמן A&I" (`<ai-menu>` from https://appofapp-gh.vercel.app/ai-menu.js). Every editing and development action (העתקת קישור, שיחת הפיתוח, פרויקט המחקר, התקנת האפליקציה, edit mode, add, delete) lives only inside it, never as loose buttons. Standard: https://github.com/Anat1969/AppOfApp-GH/blob/main/docs/ai-menu-standard.md

## בעלות ולוגו
אפליקציה של ענת (לא של עיריית אשדוד). כפתור הלוגו: `<ai-menu>` רגיל, בלי `brand="ashdod"`.

## סקיל הבנייה
עובדים לפי `.claude/skills/anat-app-builder/SKILL.md`. לפני כל שינוי קוראים אותו ואת הקובץ הזה.

## מבנה
- `app/` אפליקציית Vite ו-React. נתונים ב-`app/src/data/letters.json`, תמונות ב-`app/public/letter-images/`.
- מצב התצוגה נשמר בכתובת (`#dashboard`, `#letter/5`, `#workflow`), ולכן "העתקת קישור" משתפת בדיוק את המסך הנוכחי.
- מצבי צבע (זהב, כחול, שחור-לבן, לבן-שחור) ומסך הפתיחה נמצאים בתוך כפתור הלוגו (`menu.items`), לא בסרגל.
- התקנה מ-Chrome: `public/manifest.webmanifest`, `public/sw.js`, אייקונים מ-`public/icon.svg` דרך `node scripts/build-icons.mjs`.
- פריסה: GitHub Pages מ-main (`.github/workflows/deploy.yml`). כתובת: https://anat1969.github.io/ALEF-BEIT-GH/

## בדיקה לפני מסירה
```
cd app && npm run build && npx vite preview --port 4173 &
NODE_PATH=$(npm root -g) node tests/smoke.mjs
```
בודק: לוגו A&I בסרגל ואין כפתורים חופשיים, כל לשונית מעדכנת כתובת, שמירה אחרי רענון, כפתורים מרובעים, התקנה (`getInstallabilityErrors` ריק), נייד בלי גלילה אופקית, הפחתת תנועה.

## יומן תיקונים
- 2026-10-27: שדרוג לפי anat-app-builder. סרגל עליון גם בדף הפתיחה, שם האפליקציה ואייקון מקשרים לדף הבית, מצבי צבע עברו לכפתור הלוגו, גופני IBM Plex Sans Hebrew ו-Mono, כפתורים מרובעים עם הרמה ושקיעה, הפחתת תנועה, אייקון אפליקציה בלי טקסט, manifest ו-service worker, מצב בכתובת, שמירת סדר היום ותצוגת לוח הבקרה, הלשונית "Workflow" הפכה ל"סדר יום".

## למדנו בבנייה
- סרגל זכוכית שקוף מדי נותן לתוכן הגלול להיראות דרכו. לסרגלים דביקים: רקע אטום כמעט (`.glass.bar`).
- `ai-menu` הוא Custom Element: ב-React מעבירים `items` דרך ref, לא כ-prop.
- ב-Playwright, שינוי שעובר דרך useEffect דורש המתנה קצרה לפני הבדיקה.
- שגיאות lint קיימות ב-LetterCard.jsx וב-useLetterImages.js (משתנים לא בשימוש, setState בתוך effect) נשארו מחוץ לשדרוג הזה.
