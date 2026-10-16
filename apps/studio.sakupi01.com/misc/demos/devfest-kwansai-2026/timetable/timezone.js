/* Temporal */

// タイムテーブルの時刻を、選んだタイムゾーンに Temporal で変換する。
// router.js が、タイムテーブルを表示するたびに init() を呼ぶ (SPA で中身が差し替わるため)
export function init(signal) {
  if (!("Temporal" in globalThis)) return;
  const EVENT_DATE = Temporal.PlainDate.from("2026-10-18");
  const VENUE_TIME_ZONE = "Asia/Tokyo";
  const OPENING = Temporal.PlainTime.from("09:30");

  const form = document.querySelector(".timezone-switcher");
  const select = form.elements.timeZone;
  const times = document.querySelectorAll(".timetable time");

  for (const time of times) {
    time.dataset.venueTime = time.dateTime;
  }

  // 選択肢にこのデバイスのタイムゾーンがなければ、2 番目に足す。中身は HTML の選択肢と同じ形にする
  const deviceTimeZone = Temporal.Now.timeZoneId();
  if (![...select.options].some((option) => option.value === deviceTimeZone)) {
    const option = document.createElement("option");
    option.value = deviceTimeZone;
    const flag = document.createElement("span");
    flag.className = "flag";
    flag.ariaHidden = "true";
    flag.textContent = "📍";
    const zone = document.createElement("span");
    zone.className = "zone";
    zone.textContent = `このデバイス (${deviceTimeZone})`;
    const opening = document.createElement("span");
    opening.className = "opening";
    option.append(flag, zone, opening);
    select.add(option, 1);
  }

  // 日付 (PlainDate) + 壁時計の時刻 (PlainTime) + タイムゾーン = 世界で一意の瞬間 (ZonedDateTime)
  function atVenue(plainTime) {
    return EVENT_DATE.toZonedDateTime({ timeZone: VENUE_TIME_ZONE, plainTime });
  }

  for (const option of select.options) {
    const opening = atVenue(OPENING).withTimeZone(option.value);
    const dayDiff = EVENT_DATE.until(opening.toPlainDate()).days;
    option.querySelector(".opening").textContent =
      `開場 ${opening.toPlainTime().toString({ smallestUnit: "minute" })}` +
      (dayDiff === 0 ? "" : ` (${dayDiff > 0 ? "+" : ""}${dayDiff}日)`);
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
  }

  select.addEventListener("change", () => render(select.value), { signal });
  render(select.value);
  form.hidden = false;
}
