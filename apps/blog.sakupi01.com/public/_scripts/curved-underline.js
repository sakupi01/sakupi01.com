if (typeof registerPaint !== "undefined") {
  class CurvedLine {
    static get inputProperties() {
      return [
        "--curved-underlineColor",
        "--curved-underlineSpread",
        "--curved-underlineWidth",
        "--curved-underlineHeight",
      ];
    }

    paint(ctx, size, properties) {
      const lineWidth =
        Number.parseInt(properties.get("--curved-underlineWidth")) || 3;
      const lineHeight =
        Number.parseInt(properties.get("--curved-underlineHeight")) ||
        size.height;
      const color =
        String(properties.get("--curved-underlineColor")) || "black";
      const spread =
        Number.parseInt(properties.get("--curved-underlineSpread")) || 50;

      // 下線の位置を調整するためのオフセットを変更
      const offset = size.height - lineHeight; // テキストの下に配置するように変更
      const midPoint = lineHeight / 2;

      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.moveTo(0, midPoint + offset);

      let curStep = spread;
      while (curStep < size.width + spread) {
        const cp1x = curStep;
        const cp1y = lineHeight * 1.5 + offset; // 制御点1のY座標を調整
        const cp2x = curStep + spread;
        const cp2y = 0 - midPoint + offset; // 制御点2のY座標を調整
        const x = curStep + spread * 2;
        const y = midPoint + offset; // 終点のY座標を調整

        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
        curStep = curStep + spread * 3;
      }
      ctx.stroke();
    }
  }

  registerPaint("curved-underline", CurvedLine);
}
