# CLAUDE.md

הנחיות־העל והסקיל הקנוני: https://github.com/Anat1969/Claude-GH (`CLAUDE.md` ו-`.claude/skills/anat-app-builder/SKILL.md`). הקובץ הזה מוסיף רק את מה שייחודי ל-22 אותיות. העותק של הסקיל בריפו הזה הוא גיבוי בלבד.

## A&I logo button
The top bar holds only the app name (links home), content navigation, and ONE logo button "אד' ענת שטיבלמן A&I" (`<ai-menu>` from https://appofapp-gh.vercel.app/ai-menu.js). Every editing and development action (העתקת קישור, שיחת הפיתוח, פרויקט המחקר, התקנת האפליקציה, edit mode, add, delete) lives only inside it, never as loose buttons. Standard: https://github.com/Anat1969/AppOfApp-GH/blob/main/docs/ai-menu-standard.md

## בעלות ולוגו
אפליקציה של ענת (לא של עיריית אשדוד). כפתור הלוגו: `<ai-menu>` רגיל, בלי `brand="ashdod"`.

## תעודת DNA
- **מטאפורה:** כל אות היא חדר. האלף-בית הוא בניין של 22 חדרים.
- **חומר:** אבן בהירה ועלה זהב על רקע לילה, כמו אור ראשון על קיר.
- **צבעים:** לילה (#0A0E1A), לילה עמוק (#141B2D), זהב (#D4AF37), זהב שחר (#F0D060), אבן (#E8E2D6), אבן דהויה (#A8A396).
- **תנועה:** איטית וסיבובית, כמו אור שנע על אבן במהלך היום. טבעת האותיות מסתובבת בדקה שלמה.
- **מקור השראה:** ספר יצירה (Sefer Yetzirah), "עשרים ושתים אותיות יסוד", והאדריכלות הים-תיכונית המינימליסטית של תמונות האותיות.

## קישורים
- ראשי: https://alef-beit-gh.vercel.app/
- המיזוג האחרון בלי Vercel: https://raw.githack.com/Anat1969/ALEF-BEIT-GH/main/build/index.html (נבנה ב-`.github/workflows/build-app.yml` לתיקייה `build/`, כי `app/` היא תיקיית הקוד).
- גיבוי: https://anat1969.github.io/ALEF-BEIT-GH/

## מבנה
- `app/` אפליקציית Vite ו-React. נתונים ב-`app/src/data/letters.json`, תמונות ב-`app/public/letter-images/`.
- כרטיס האות: `app/src/components/LetterCard.jsx` (מסגרת וניווט), וכל מקטע בקובץ משלו ב-`app/src/components/letter/`. קבועים משותפים ב-`letter/constants.js`.
- מצב התצוגה נשמר בכתובת (`#dashboard`, `#letter/5`, `#workflow`), ולכן "העתקת קישור" משתפת בדיוק את המסך הנוכחי.
- טקסט: `app/src/components/text/RichText.jsx` לפי תקן הזיקוק של Claude-GH. `**מילה**` מרקר, `==תובנה==` מרקר צהוב, מספרים ואנגלית מבודדים אוטומטית. `MeaningBox`: בעיה באדום, פתרון בירוק, תובנה בצהוב.
- סדר היום: `app/src/data/dailySkills.js`, מקור אחד ל"סדר יום" ולכרטיס "עכשיו בסדר היום" בדף הבית.
- דף הבית `#home` (`app/src/components/Home.jsx`): טבעת תלת־ממד של 22 האותיות, חזון, מטרה ושיטה, שישה כלים, תוצאות שנספרות מהנתונים, ומפת תוכן לפי גימטריה (אחדות, עשרות, מאות). הוא מחליף את מסך הפתיחה הישן.
- מצבי צבע (זהב, כחול, שחור-לבן, לבן-שחור) נמצאים בתוך כפתור הלוגו (`menu.items`), לא בסרגל.
- לוח צבעים עם שמות ב-`index.css`: לילה, לילה עמוק, זהב, זהב שחר, אבן, אבן דהויה. שאר האסימונים מפנים אליו.
- מזהי האותיות הם ערכי הגימטריה (1 עד 10, 20 עד 90, 100 עד 400). מעבר קודמת והבאה הולך לפי הסדר ברשימה, לא לפי מזהה פלוס אחד.
- התקנה מ-Chrome: `public/manifest.webmanifest`, `public/sw.js`, אייקונים מ-`public/icon.svg` דרך `node scripts/build-icons.mjs`.
- פריסה: Vercel מ-main, פרויקט `alef-beit-gh` (Root Directory: `app`). `app/vercel.json` מדלג על קומיט שלא משנה את `app/`, כך שבניית `build/` לא צורכת פריסה.
- `base` ב-vite.config.js: `/` ב-Vercel (משתנה `VERCEL`), `/ALEF-BEIT-GH/` ב-GitHub Pages, `./` ב-`build:github`. ה-service worker נרשם רק כשהבסיס הוא `/`.

## בדיקה לפני מסירה
```
cd app && VERCEL=1 npm run build && (VERCEL=1 npx vite preview --port 4173 &)
NODE_PATH=$(npm root -g) node tests/smoke.mjs
BASE=https://alef-beit-gh.vercel.app/ NODE_PATH=$(npm root -g) node tests/smoke.mjs   # מול האתר החי
```
`ai-menu.js` נטען בבדיקה מעותק מקומי ב-`app/tests/fixtures/`.
בודק: לוגו A&I בסרגל ואין כפתורים חופשיים, כל לשונית מעדכנת כתובת, שמירה אחרי רענון, כפתורים מרובעים, התקנה (`getInstallabilityErrors` ריק), נייד בלי גלילה אופקית, הפחתת תנועה.

## יומן תיקונים
- 2026-10-27: שדרוג לפי anat-app-builder. סרגל עליון גם בדף הפתיחה, שם האפליקציה ואייקון מקשרים לדף הבית, מצבי צבע עברו לכפתור הלוגו, גופני IBM Plex Sans Hebrew ו-Mono, כפתורים מרובעים עם הרמה ושקיעה, הפחתת תנועה, אייקון אפליקציה בלי טקסט, manifest ו-service worker, מצב בכתובת, שמירת סדר היום ותצוגת לוח הבקרה, הלשונית "Workflow" הפכה ל"סדר יום".

- 2026-10-27: lint נקי, פיצול LetterCard.jsx לקובץ לכל מקטע, פריסה ל-Vercel, בדיקה שעוברת על כל מקטעי כרטיס האות.

- 2026-10-27: דף בית אמיתי, לוח צבעים עם שמות, כותרות דקות ועומק בכרטיסים. תוקן באג ישן: אחרי י' הכפתור "הבאה" הוביל לאות שלא קיימת, ו"הקודמת" מא' לא עבדה.

- 2026-10-27: השבחה מול הסקיל הקנוני ב-Claude-GH (העותק המקומי היה ישן). תעודת DNA, טקסטים מזוקקים עם RichText וצבעי משמעות, כותרות במשקל 400 עד 500, כרטיס "עכשיו בסדר היום", דוגמה מאשדוד, מקור השראה, README עם קישור חי, קישור raw.githack.

## למדנו בבנייה
- סרגל זכוכית שקוף מדי נותן לתוכן הגלול להיראות דרכו. לסרגלים דביקים: רקע אטום כמעט (`.glass.bar`).
- `ai-menu` הוא Custom Element: ב-React מעבירים `items` דרך ref, לא כ-prop.
- ב-Playwright, שינוי שעובר דרך useEffect דורש המתנה קצרה לפני הבדיקה.
- פרויקט Vercel שנוצר דרך ה-API לא נפרס עד הדחיפה הבאה. את הפריסה הראשונה מפעילים ב-create_deployment עם gitSource על main.
- מהסביבה הזו vercel.app כן נגיש, ולכן בדיקת smoke רצה גם מול האתר החי (`BASE=https://alef-beit-gh.vercel.app/`).
- לא נותנים שם מחלקה שמתנגש עם Tailwind (`ring`, `shadow`, `border`): `.ring` צייר מסגרת לבנה באמצע הטבעת. משתמשים בשמות כמו `letter-ring`.
- ריווח אותיות רחב שובר מילים בעברית. בתוויות עבריות: עד 0.06em.
- IBM Plex Mono בלי עברית: בלי גיבוי, העברית נופלת לגופן מערכת רחב. ב-`--font-mono` שמים את IBM Plex Sans Hebrew מיד אחריו.
- צילום עמוד מלא בנייד של דף ארוך עם תלת־ממד נתקע ב-headless. מצלמים בגובה מסך.
- איפוס מצב כשמחליפים אות: `key={letter.id}` על הרכיב, לא setState בתוך useEffect.
