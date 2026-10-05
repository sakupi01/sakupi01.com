/* global Temporal, Option -- リポジトリの eslint.config.js の globals に無いブラウザの API */

// タイムテーブルの時刻を、選んだタイムゾーンに Temporal で変換する。
// Temporal 未対応のブラウザでは何もしない。HTML に書いた会場時刻がそのまま表として読める
if ("Temporal" in globalThis) {
  const EVENT_DATE = Temporal.PlainDate.from("2026-10-18");
  const VENUE_TIME_ZONE = "Asia/Tokyo";
  const OPENING = Temporal.PlainTime.from("09:30");

  const form = document.querySelector(".timezone-switcher");
  const select = form.elements.timeZone;
  const times = document.querySelectorAll(".timetable time");

  // HTML に書いた「会場の壁時計の時刻」を元データとして残しておく
  for (const time of times) {
    time.dataset.venueTime = time.dateTime;
  }

  const deviceTimeZone = Temporal.Now.timeZoneId();
  if (![...select.options].some((option) => option.value === deviceTimeZone)) {
    select.add(
      new Option(`このデバイス (${deviceTimeZone})`, deviceTimeZone),
      1
    );
  }

  // 日付 (PlainDate) + 壁時計の時刻 (PlainTime) + タイムゾーン = 世界で一意の瞬間 (ZonedDateTime)
  function atVenue(plainTime) {
    return EVENT_DATE.toZonedDateTime({ timeZone: VENUE_TIME_ZONE, plainTime });
  }

  function render(timeZone) {
    for (const time of times) {
      const zoned = atVenue(
        Temporal.PlainTime.from(time.dataset.venueTime)
      ).withTimeZone(timeZone);
      const dayDiff = EVENT_DATE.until(zoned.toPlainDate()).days;
      const dayLabel =
        dayDiff === 0 ? "" : ` (${dayDiff > 0 ? "+" : ""}${dayDiff}日)`;

      time.dateTime = zoned.toString({
        timeZoneName: "never",
        smallestUnit: "minute",
      });
      time.textContent =
        zoned.toPlainTime().toString({ smallestUnit: "minute" }) + dayLabel;
    }

    const opening = atVenue(OPENING);
    form.elements.ixdtf.value = `${opening.toString({ smallestUnit: "minute" })} = ${opening
      .withTimeZone(timeZone)
      .toString({ smallestUnit: "minute" })}`;
  }

  function renderCountdown() {
    const now = Temporal.Now.zonedDateTimeISO(VENUE_TIME_ZONE);
    const opening = atVenue(OPENING);
    const countdown = form.querySelector(".countdown");

    if (Temporal.ZonedDateTime.compare(now, opening) >= 0) {
      countdown.textContent = "";
      return;
    }
    const remaining = now.until(opening, {
      largestUnit: "day",
      smallestUnit: "minute",
      roundingMode: "floor",
    });
    countdown.textContent = `開場まで あと ${remaining.toLocaleString("ja-JP", { style: "long" })}`;
  }

  select.addEventListener("change", () => {
    render(select.value);
    // 日付ラベルの増減で高さが変わるので、埋め込み先の iframe に再計測を頼む
    if (window.parent !== window && "requestResize" in window)
      window.requestResize();
  });
  render(select.value);
  renderCountdown();
  form.hidden = false;
}
