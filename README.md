# Motions — سیستم ساخت ریلز موشن‌گرافیک روایی

## ساختار

```
Motions/
├── core/          کد مشترک همهٔ استایل‌ها: انیمیشن، کپشن RTL، کاغذ، فونت، فرمت story، رجیستری استایل‌ها
├── tools/         ابزارهای مرکزی
│   ├── transcribe.mjs   ترنسکریپت + کلمات + جمله‌بندی بر اساس مکث با Whisper API (AvalAI)
│   ├── sentences.mjs    جمله‌بندی دوباره با مکث دیگر، بدون تماس دوباره با API
│   ├── render.mjs       رندر یک پروژه
│   └── assets.mjs       پرامپت/چک/ساخت تصاویر asset (همیشه با کاراکتر شیت استایل)
├── assets/fonts/  فونت‌های مشترک (Dast Nevis + IRANYekanX — داخل git نیست)
├── styles/        هر استایل یک پوشه + STYLE.md (قوانین طراحی آن استایل)
│   └── ink-dot/   روایت مینیمال، پس‌زمینهٔ مشکی + نقطه/خط/متن سفید (تم light = کاغذ کرم)
├── inputs/        فایل‌های ورودی (صدا، ویدیو، متن)
└── outputs/       هر پروژه یک پوشه: PLAN.md + story.json + ویدیوی نهایی
```

## روند کار یک پروژهٔ جدید

0. **از کاربر بپرس:** خروجی عمودی ۹:۱۶ (`portrait`) می‌خواهد یا افقی (`landscape`)؟ (و اگر نظری دارد: فونت `dast-nevis` / `iran-yekan`). جواب را در `story.json` → `"format"` / `"font"` بنویس.
1. فایل‌های ورودی را در `inputs/` بگذار.
2. (اگر صدا داریم) `npm run transcribe -- inputs/voice.mp3 --project <project>` → در `outputs/<project>/`:
   - `voice.*` (صدای روایت، برای story.audio) · `transcript.raw.json` (پاسخ خام API)
   - `transcript.json` (متن کامل + segments + **words** با زمان + **sentences** بر اساس مکث)
   - `story.draft.json` (هر جمله یک بیت، زمان‌بندی‌شده با صدا؛ scene = TODO)
   اگر جمله‌ها زیادی خرد/بلند شدند: `npm run sentences -- <project> --pause 0.6 --max-words 8`
3. `outputs/<project>/PLAN.md` — داستان، استایل، بیت‌ها و استعاره‌های بصری.
4. `outputs/<project>/story.json` — طبق `styles/<style>/STYLE.md` (اگر draft داریم: scene هر بیت را انتخاب کن، کپشن را تمیز کن/هایلایت بگذار، `seconds` را دست نزن).
4.5. (اگر تصویر لازم است) `outputs/<project>/assets.json` → `npm run assets -- <project> prompts` →
     تصاویر را با کاراکتر شیت بساز و در `outputs/<project>/assets/<id>.png` بگذار → `npm run assets -- <project> check`
5. `npm run render -- <project>` → `outputs/<project>/<project>.mp4` (افقی: `<project>-landscape.mp4`)
   - بدون ویرایش فایل: `--format landscape|portrait`، `--font iran-yekan|dast-nevis`، `--theme dark|light`
   - رندر طولانی است: ایجنت خودش اجرا نمی‌کند، دستور را به کاربر می‌دهد.

## تنظیمات

`.env` تنظیم شده: AvalAI (`OPENAI_BASE_URL=https://api.avalai.ir/v1`، `WHISPER_MODEL=whisper-1`). اگر اتصال timeout داد، VPN را چک کن.
برای ساخت خودکار تصویر (اختیاری): `IMAGE_API_KEY`، `IMAGE_BASE_URL`، `IMAGE_MODEL` (پیش‌فرض gpt-image-1، endpoint `/images/edits` با شیت ضمیمه).

## افزودن استایل جدید

پوشهٔ `styles/<id>/` با `STYLE.md`، `assets.config.json` + `reference/` (کاراکتر شیت)، `index.ts` (export یک `StyleDef`) و `example.story.json` بساز و در `core/styles.ts` ثبتش کن. id استایل = id کامپوزیشن Remotion = مقدار `style` در story.json.
