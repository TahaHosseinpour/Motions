// Act 2 — Omid's story: the brief, the weekend build, the SMS-credit disaster.
import React from "react";
import { AssetImage } from "../../../core/AssetImage";
import { ease, hop, mix, tween } from "../../../core/anim";
import { Bubble, Button, CalendarDay, Check, CodeWindow, Coin, Cross, Doc, Envelope, Gear, Jar, Phone, Ring, SpeedLines, Tank, Txt } from "../kit";
import { SceneDef, T, cue, fa, line } from "../theme";

const NUMBERS = ["۰۹۱۲۱۱۱۲۲۳۳", "۰۹۳۵۴۴۴۵۵۶۶", "۰۹۱۹۷۷۸۸۹۹", "۰۹۱۲۳۳۳۴۴۵۵", "۰۹۳۶۶۶۷۷۸۸", "۰۹۱۵۱۱۲۲۳۳"];

// 4 ── Omid the freelancer; a saffron shop wants an online store with SMS login.
export const wOmidBrief: SceneDef = {
  Visual: ({ f, dur, p }) => {
    const c1 = cue(p, 1, dur, 0.21);
    const c2 = cue(p, 2, dur, 0.46);
    const phoneP = tween(f, c1, c1 + 18, 0, 1, ease.out);
    const px = 880, py = mix(560, 470, phoneP);
    const digits = Math.floor(tween(f, c2, c2 + 22, 0, 4));
    return (
      <g>
        {/* saffron shop, left */}
        <Jar x={280} y={540} color={T.saffron} label="زعفران‌فروشی" fill={tween(f, c1, c1 + 14)} o={tween(f, c1 - 6, c1 + 6)} />
        <Bubble x={300} y={300} w={320} h={120} tail={1} o={tween(f, c1 + 4, c1 + 16, 0, 1, ease.back)}>
          <Txt x={0} y={-6} size={30}>فروشگاه اینترنتی</Txt>
          <Txt x={0} y={34} size={30} color={T.inkSoft}>با ورود پیامکی</Txt>
        </Bubble>
        {/* the store phone, center */}
        <g opacity={phoneP}>
          <Phone x={px} y={py} w={300} h={520} p={1}>
            <path d={`M ${px - 110} ${py - 180} h 220 l -16 34 h -188 Z`} {...line(T.thin)} stroke={T.saffron} />
            <Txt x={px} y={py - 96} size={30}>فروشگاه</Txt>
            <rect x={px - 110} y={py - 40} width={220} height={64} rx={12} {...line(T.thin)} stroke={T.inkSoft} />
            <Txt x={px} y={py - 52} size={22} color={T.inkSoft}>کد ورود</Txt>
            {[0, 1, 2, 3].map((i) => (
              <Txt key={i} x={px - 72 + i * 48} y={py + 2} size={34} sans color={i < digits ? T.highlight : T.inkFaint}>{i < digits ? fa(i + 1) : "•"}</Txt>
            ))}
            <Button x={px} y={py + 110} w={220} h={62} label="ارسال کد" />
          </Phone>
        </g>
        {/* Omid, right */}
        <AssetImage id="omid-freelancer" x={1480} y={520} w={400} h={400} p={tween(f, 2, 22)} reveal="wipe" ink={T.ink} font={T.font} />
        <Txt x={1480} y={752} size={38} o={tween(f, 14, 26)}>امید · فریلنسر</Txt>
      </g>
    );
  },
  dot: (f, dur, p) => {
    const c1 = cue(p, 1, dur, 0.21);
    const c2 = cue(p, 2, dur, 0.46);
    if (f < c1) return { x: 1480, y: 400 + 5 * Math.sin(f * 0.2), r: T.dotR };
    if (f < c2) return { ...hop(tween(f, c1, c1 + 12, 0, 1, ease.inOut), 1480, 400, 300, 300, 120), r: T.dotR };
    return { ...hop(tween(f, c2, c2 + 12, 0, 1, ease.inOut), 300, 300, 880, 470, 130), r: T.dotR };
  },
};

// 5 ── weekend with a coding agent; Saturday morning the site is live.
export const wWeekendBuild: SceneDef = {
  Visual: ({ f, dur, p }) => {
    const c1 = cue(p, 1, dur, 0.64);
    const thu = tween(f, 10, 26, 0, 1, ease.out);
    const fri = tween(f, 34, 50, 0, 1, ease.out);
    const rise = tween(f, c1, c1 + 22, 0, 1, ease.out);
    const sun = tween(f, c1, c1 + 26, 0, 1, ease.out);
    const write = (f * 0.06) % 1;
    return (
      <g>
        <Txt x={820} y={158} size={36} color={T.inkSoft} o={tween(f, 4, 16)}>آخر هفته</Txt>
        <CalendarDay x={560} y={262} label="پنجشنبه" state={thu > 0.9 ? "done" : "active"} p={tween(f, 2, 12)} />
        <CalendarDay x={820} y={262} label="جمعه" state={fri > 0.9 ? "done" : thu > 0.9 ? "active" : "idle"} p={tween(f, 6, 16)} />
        <CalendarDay x={1080} y={262} label="شنبه" state={rise > 0.5 ? "active" : "idle"} p={tween(f, 10, 20)} />
        {/* agent working */}
        <Gear x={330} y={520} r={62} rot={f * 4} color={T.digital} o={tween(f, 8, 20)} />
        <CodeWindow x={640} y={560} w={440} h={280} lines={5} p={0.3 + write * 0.7} o={tween(f, 12, 24)} accent={T.digital} />
        {/* sunrise + live storefront */}
        <g opacity={sun}>
          <path d={`M 1230 ${mix(660, 470, sun)} A 150 150 0 0 1 1530 ${mix(660, 470, sun)}`} {...line(4)} stroke={T.turmeric} />
          {[0, 1, 2, 3, 4].map((i) => {
            const a = Math.PI * (0.15 + i * 0.175);
            const cx = 1380, cy = mix(660, 470, sun);
            return <line key={i} x1={cx + Math.cos(a) * 175} y1={cy - Math.sin(a) * 175} x2={cx + Math.cos(a) * 205} y2={cy - Math.sin(a) * 205} {...line(4)} stroke={T.turmeric} opacity={sun} />;
          })}
        </g>
        <g opacity={rise} transform={`translate(0 ${mix(40, 0, rise)})`}>
          <rect x={1230} y={430} width={300} height={230} rx={18} {...line(5)} fill={T.paper} />
          <path d="M 1230 470 h 300 l -14 26 h -272 Z" {...line(T.thin)} stroke={T.saffron} />
          <Txt x={1380} y={560} size={34}>فروشگاه</Txt>
          <g transform={`translate(1380 615)`}>
            <rect x={-92} y={-26} width={184} height={52} rx={26} {...line(4)} stroke={T.good} fill="rgba(1,205,152,0.14)" />
            <Check x={-58} y={0} s={16} w={5} />
            <Txt x={14} y={12} size={30} color={T.good}>آنلاین</Txt>
          </g>
        </g>
        <Txt x={1380} y={742} size={36} color={T.inkSoft} o={rise}>شنبه صبح · سایت بالا اومد</Txt>
      </g>
    );
  },
  dot: (f, dur, p) => {
    const c1 = cue(p, 1, dur, 0.64);
    if (f < c1) return { x: 330, y: 450 + 6 * Math.sin(f * 0.3), r: T.dotR };
    return { ...hop(tween(f, c1, c1 + 16, 0, 1, ease.inOut), 330, 450, 1380, 615, 160), r: T.dotR };
  },
};

// 6 ── two weeks later: the 2M-toman SMS credit vanished in three days.
export const wPhoneRings: SceneDef = {
  Visual: ({ f, dur, p }) => {
    const c1 = cue(p, 1, dur, 0.36);
    const c2 = cue(p, 2, dur, 0.76);
    const drain = tween(f, c1, c2 + 16, 1, 0, ease.in);
    const ring = (f % 30) / 30;
    const credit = Math.round(2000000 * drain);
    const col = drain > 0.4 ? T.digital : T.bad;
    return (
      <g>
        <AssetImage id="omid-shocked" x={400} y={500} w={380} h={380} p={tween(f, 2, 20)} reveal="pop" ink={T.ink} font={T.font} />
        {[0, 1, 2].map((i) => (
          <path key={i} d={`M ${560 + i * 26} ${330 - i * 8} q 26 30 0 62`} {...line(4)} stroke={T.bad} opacity={tween(f, 8, 18) * (0.4 + 0.6 * Math.abs(Math.sin(f * 0.3 + i)))} />
        ))}
        <g opacity={tween(f, 4, 14)}>
          <rect x={280} y={210} width={240} height={56} rx={28} {...line(T.thin)} stroke={T.inkSoft} fill={T.paper} />
          <Txt x={400} y={248} size={30} color={T.inkSoft}>۲ هفته بعد</Txt>
        </g>
        {/* draining credit tank */}
        <Tank x={1380} y={500} w={300} h={420} level={drain} color={col} p={tween(f, 10, 26)} label="شارژ پنل پیامک" />
        <Txt x={1380} y={770} size={44} sans color={col}>{`${fa(credit)} تومان`}</Txt>
        {[1, 2, 3].map((d) => (
          <Txt key={d} x={1230 + d * 100} y={808} size={26} color={drain < 1 - (d - 1) / 3 ? T.bad : T.inkSoft}>{`روز ${fa(d)}`}</Txt>
        ))}
        {drain < 0.05 && <Cross x={1380} y={500} s={70} p={tween(f, c2 + 12, c2 + 22)} />}
      </g>
    );
  },
  dot: (f, dur, p) => {
    const c1 = cue(p, 1, dur, 0.36);
    const c2 = cue(p, 2, dur, 0.76);
    if (f < c1) return { x: 400, y: 360 + 5 * Math.sin(f * 0.25), r: T.dotR };
    const drain = tween(f, c1, c2 + 16, 1, 0, ease.in);
    const surface = 702 - drain * 396;
    if (f < c1 + 12) return { ...hop(tween(f, c1, c1 + 12, 0, 1, ease.inOut), 400, 360, 1380, 306, 120), r: T.dotR };
    return { x: 1380, y: surface, r: T.dotR };
  },
  cam: (f, dur, p) => ({ z: 1 + 0.04 * tween(f, cue(p, 1, dur, 0.36), dur, 0, 1, ease.in), x: 10 * tween(f, 0, dur) }),
};

// 7 ── a bot hammers the login form: every request = one SMS + less balance.
export const wBotAttack: SceneDef = {
  Visual: ({ f, dur, p }) => {
    const c1 = cue(p, 1, dur, 0.27);
    const c2 = cue(p, 2, dur, 0.66);
    const px = 680, py = 470;
    const presses = f < c1 ? 0 : Math.floor((f - c1) / 12) + 1;
    const phase = f < c1 ? 1 : ((f - c1) % 12) / 12;
    const press = phase < 0.3 ? 1 : 0;
    const num = NUMBERS[presses % NUMBERS.length];
    const balance = Math.max(0, 1 - presses * 0.05);
    return (
      <g>
        {/* login phone */}
        <Phone x={px} y={py} w={320} h={540} p={tween(f, 0, 16)}>
          <Txt x={px} y={py - 180} size={30}>ورود پیامکی</Txt>
          <rect x={px - 120} y={py - 120} width={240} height={62} rx={12} {...line(T.thin)} stroke={T.inkSoft} />
          <Txt x={px} y={py - 78} size={30} sans color={T.digital}>{num}</Txt>
          <Button x={px} y={py + 10} w={240} h={66} label="ارسال کد" press={press} />
          <Txt x={px} y={py + 110} size={24} color={T.inkSoft}>{fa(presses)} درخواست</Txt>
        </Phone>
        {/* the bot */}
        <AssetImage id="evil-bot" x={1340} y={480} w={360} h={360} p={tween(f, 6, 24)} reveal="wipe" ink={T.ink} font={T.font} />
        <Txt x={1340} y={700} size={36} color={T.bad} o={tween(f, 16, 28)}>ربات</Txt>
        {/* balance meter, far right */}
        <Tank x={1720} y={500} w={130} h={300} level={balance} color={balance > 0.4 ? T.digital : T.bad} p={tween(f, 12, 26)} label="موجودی" />
        {/* flying SMS envelopes + dropping coins per press */}
        {Array.from({ length: 5 }, (_, k) => {
          const i = presses - k;
          if (i < 1) return null;
          const start = c1 + (i - 1) * 12;
          const t = tween(f, start, start + 22, 0, 1, ease.out);
          if (t >= 1) return null;
          const ex = mix(px + 120, 1640, t), ey = mix(py - 40, 380, t) - 60 * Math.sin(t * Math.PI);
          return (
            <g key={i} opacity={1 - t * 0.7}>
              <Envelope x={ex} y={ey} s={0.8} rot={t * 20} color={T.digital} />
              <Coin x={ex + 30} y={ey + 60 + t * 80} r={16} o={1 - t} color={T.bad} />
            </g>
          );
        })}
        {press > 0 && <Ring x={px} y={py + 10} r={70} p={phase / 0.3} color={T.bad} />}
        <SpeedLines x={1180} y={470} len={70} o={tween(f, c1, c1 + 10)} dir={1} />
      </g>
    );
  },
  dot: (f, dur, p) => {
    const c1 = cue(p, 1, dur, 0.27);
    if (f < c1) return { x: 1340, y: 420, r: T.dotR };
    const phase = ((f - c1) % 12) / 12;
    const down = phase < 0.3 ? tween(f, c1 + Math.floor((f - c1) / 12) * 12, c1 + Math.floor((f - c1) / 12) * 12 + 4, 0, 1) : 0;
    return { x: 680, y: 400 + down * 80, r: T.dotR };
  },
  cam: (f, dur, p) => ({ z: 1.02 + 0.02 * Math.sin(f * 0.1), x: 4 * Math.sin(f * 0.15) }),
};

// 8 ── the code was fine, tests green — but nobody specified the rate limit.
export const wTestsGreen: SceneDef = {
  Visual: ({ f, dur, p }) => {
    const c1 = cue(p, 1, dur, 0.39);
    const c2 = cue(p, 2, dur, 0.57);
    const rows = 5;
    return (
      <g>
        {/* right: green tests */}
        <g opacity={tween(f, 4, 18)}>
          <rect x={1120} y={280} width={520} height={400} rx={20} {...line(5)} fill={T.paper} />
          <Txt x={1380} y={252} size={36} color={T.good}>تست‌ها سبز</Txt>
          {Array.from({ length: rows }, (_, i) => {
            const rp = tween(f, 16 + i * 12, 28 + i * 12, 0, 1, ease.out);
            const yy = 340 + i * 66;
            return (
              <g key={i} opacity={rp}>
                <line x1={1300} y1={yy} x2={1560} y2={yy} {...line(4)} stroke={T.inkSoft} />
                <Check x={1200} y={yy} s={20} w={6} p={rp} />
              </g>
            );
          })}
          <Txt x={1380} y={742} size={34} color={T.inkSoft}>کدِ ایجنت ایراد نداشت</Txt>
        </g>
        {/* left: the spec with a missing line */}
        <Doc x={480} y={480} w={440} h={440} lines={6} p={tween(f, 8, 40)} />
        <g opacity={tween(f, c1, c1 + 14)}>
          <rect x={300} y={556} width={360} height={70} rx={12} {...line(4)} stroke={T.highlight} strokeDasharray="12 10" fill="rgba(1,205,152,0.06)" />
          <Txt x={490} y={602} size={30} color={T.highlight}>چند بار در دقیقه؟</Txt>
          <Txt x={330} y={606} size={40} color={T.highlight}>؟</Txt>
        </g>
        <Txt x={480} y={742} size={34} color={T.inkSoft} o={tween(f, c1, c1 + 12)}>فقط هیچکی نگفته بود…</Txt>
      </g>
    );
  },
  dot: (f, dur, p) => {
    const c1 = cue(p, 1, dur, 0.39);
    if (f < c1) return { x: 1200, y: 340 + 5 * Math.sin(f * 0.2), r: T.dotR };
    return { ...hop(tween(f, c1, c1 + 14, 0, 1, ease.inOut), 1200, 340, 330, 592, 150), r: T.dotR };
  },
};

// 9 ── the agent didn't build what nobody asked for: a hole where rate-limit should be.
export const wMissingPiece: SceneDef = {
  Visual: ({ f, dur, p }) => {
    const c1 = cue(p, 1, dur, 0.51);
    const blocks = [
      { x: 360, y: 360, t: "ورود پیامکی" }, { x: 720, y: 360, t: "فروشگاه" }, { x: 1440, y: 360, t: "پرداخت" },
      { x: 360, y: 560, t: "سبد خرید" }, { x: 720, y: 560, t: "حساب کاربری" }, { x: 1080, y: 560, t: "جستجو" }, { x: 1440, y: 560, t: "گزارش‌ها" },
    ];
    const leak = tween(f, c1, c1 + 10, 0, 1);
    return (
      <g>
        {blocks.map((b, i) => {
          const bp = tween(f, 4 + i * 6, 18 + i * 6, 0, 1, ease.back);
          return (
            <g key={b.t} opacity={bp} transform={`translate(${b.x} ${b.y}) scale(${bp})`}>
              <rect x={-150} y={-72} width={300} height={144} rx={16} {...line(4)} fill={T.paper} />
              <Txt x={0} y={12} size={30}>{b.t}</Txt>
            </g>
          );
        })}
        {/* the missing rate-limit block */}
        <g opacity={tween(f, 30, 44)}>
          <rect x={930} y={288} width={300} height={144} rx={16} {...line(5)} stroke={T.bad} strokeDasharray="14 12" fill="rgba(240,86,74,0.06)" />
          <Txt x={1080} y={350} size={30} color={T.bad}>محدودیت نرخ</Txt>
          <Txt x={1080} y={392} size={22} sans color={T.bad}>Rate Limit</Txt>
          <Cross x={1080} y={360} s={54} p={tween(f, c1 - 6, c1 + 6)} w={5} />
        </g>
        {/* SMS leaking through the hole */}
        {leak > 0 && Array.from({ length: 6 }, (_, k) => {
          const t = ((f - c1) / 40 + k / 6) % 1;
          const ex = mix(1080, 1750, t), ey = mix(360, 180, t);
          return <Envelope key={k} x={ex} y={ey} s={0.7} rot={t * 30} o={(1 - t) * leak} color={T.bad} />;
        })}
        <Txt x={960} y={742} size={36} color={T.inkSoft} o={tween(f, c1, c1 + 12)}>چیزی که کسی نخواسته بود، ساخته نشد</Txt>
      </g>
    );
  },
  dot: (f, dur, p) => {
    const c1 = cue(p, 1, dur, 0.51);
    if (f < c1 - 10) return { x: 360, y: 300 + 5 * Math.sin(f * 0.2), r: T.dotR };
    if (f < c1) return { ...hop(tween(f, c1 - 10, c1, 0, 1, ease.inOut), 360, 300, 1080, 300, 90), r: T.dotR };
    const bounce = Math.abs(Math.sin((f - c1) * 0.25)) * 26;
    return { x: 1080, y: 270 - bounce, r: T.dotR };
  },
};