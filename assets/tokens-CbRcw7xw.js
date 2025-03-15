const r={hue:{red:"9.99",purple:"322",violet:"290",blue:"271",cyan:"242",green:"168",orange:"36",selected:"9.99",gray:"90",ivory:"90.1"},color:{selected:{0:`oklch(
    from var(--color-selected-2) calc(l + 0.99) var(--chroma-0, 0.03) h
  )`,1:`oklch(
    from var(--color-selected-2) calc(l + 0.88) var(--chroma-1, 0.12) h
  )`,2:`oklch(
    var(--lightness, 66%) var(--chroma-2, 0.17) var(--hue-selected, 0)
  )`,3:`oklch(
    from var(--color-selected-2) calc(l * 0.53) var(--chroma-3, 0.2) h
  )`,4:`oklch(
    from var(--color-selected-2) calc(l * 0.27) var(--chroma-4, 0.12) h
  )`,5:`oklch(
    from var(--color-selected-2) calc(l * 0.14) var(--chroma-4, 0.08) h
  )`},red:{0:`oklch(
    from var(--color-red-2) calc(l + 0.99) var(--chroma-0, 0.03) h
  )`,1:`oklch(
    from var(--color-red-2) calc(l + 0.88) var(--chroma-1, 0.12) h
  )`,2:`oklch(
    var(--lightness, 66%) var(--chroma-2, 0.17) var(--hue-red, 0)
  )`,3:`oklch(
    from var(--color-red-2) calc(l * 0.53) var(--chroma-3, 0.2) h
  )`,4:`oklch(
    from var(--color-red-2) calc(l * 0.27) var(--chroma-4, 0.12) h
  )`,5:`oklch(
    from var(--color-red-2) calc(l * 0.14) var(--chroma-4, 0.08) h
  )`},purple:{0:`oklch(
    from var(--color-purple-2) calc(l + 0.99) var(--chroma-0, 0.03) h
  )`,1:`oklch(
    from var(--color-purple-2) calc(l + 0.88) var(--chroma-1, 0.12) h
  )`,2:`oklch(
    var(--lightness, 66%) var(--chroma-2, 0.17) var(--hue-purple, 0)
  )`,3:`oklch(
    from var(--color-purple-2) calc(l * 0.53) var(--chroma-3, 0.2) h
  )`,4:`oklch(
    from var(--color-purple-2) calc(l * 0.27) var(--chroma-4, 0.12) h
  )`,5:`oklch(
    from var(--color-purple-2) calc(l * 0.14) var(--chroma-4, 0.08) h
  )`},violet:{0:`oklch(
    from var(--color-violet-2) calc(l + 0.99) var(--chroma-0, 0.03) h
  )`,1:`oklch(
    from var(--color-violet-2) calc(l + 0.88) var(--chroma-1, 0.12) h
  )`,2:`oklch(
    var(--lightness, 66%) var(--chroma-2, 0.17) var(--hue-violet, 0)
  )`,3:`oklch(
    from var(--color-violet-2) calc(l * 0.53) var(--chroma-3, 0.2) h
  )`,4:`oklch(
    from var(--color-violet-2) calc(l * 0.27) var(--chroma-4, 0.12) h
  )`,5:`oklch(
    from var(--color-violet-2) calc(l * 0.14) var(--chroma-4, 0.08) h
  )`},blue:{0:`oklch(
    from var(--color-blue-2) calc(l + 0.99) var(--chroma-0, 0.03) h
  )`,1:`oklch(
    from var(--color-blue-2) calc(l + 0.88) var(--chroma-1, 0.12) h
  )`,2:`oklch(
    var(--lightness, 66%) var(--chroma-2, 0.17) var(--hue-blue, 0)
  )`,3:`oklch(
    from var(--color-blue-2) calc(l * 0.53) var(--chroma-3, 0.2) h
  )`,4:`oklch(
    from var(--color-blue-2) calc(l * 0.27) var(--chroma-4, 0.12) h
  )`,5:`oklch(
    from var(--color-blue-2) calc(l * 0.14) var(--chroma-4, 0.08) h
  )`},cyan:{0:`oklch(
    from var(--color-cyan-2) calc(l + 0.99) var(--chroma-0, 0.03) h
  )`,1:`oklch(
    from var(--color-cyan-2) calc(l + 0.88) var(--chroma-1, 0.12) h
  )`,2:"oklch(var(--lightness, 66%) 0.08 var(--hue-cyan, 0))",3:`oklch(
    from var(--color-cyan-2) calc(l * 0.53) var(--chroma-3, 0.2) h
  )`,4:`oklch(
    from var(--color-cyan-2) calc(l * 0.27) var(--chroma-4, 0.12) h
  )`,5:`oklch(
    from var(--color-cyan-2) calc(l * 0.14) var(--chroma-4, 0.08) h
  )`},green:{0:`oklch(
    from var(--color-green-2) calc(l + 0.99) var(--chroma-0, 0.03) h
  )`,1:`oklch(
    from var(--color-green-2) calc(l + 0.88) var(--chroma-1, 0.12) h
  )`,2:`oklch(
    var(--lightness, 66%) var(--chroma-2, 0.17) var(--hue-green, 0)
  )`,3:`oklch(
    from var(--color-green-2) calc(l * 0.53) var(--chroma-3, 0.2) h
  )`,4:`oklch(
    from var(--color-green-2) calc(l * 0.27) var(--chroma-4, 0.12) h
  )`,5:`oklch(
    from var(--color-green-2) calc(l * 0.14) var(--chroma-4, 0.08) h
  )`},orange:{0:`oklch(
    from var(--color-orange-2) calc(l + 0.99) var(--chroma-0, 0.03) h
  )`,1:`oklch(
    from var(--color-orange-2) calc(l + 0.88) var(--chroma-1, 0.12) h
  )`,2:`oklch(
    var(--lightness, 66%) var(--chroma-2, 0.17) var(--hue-orange, 0)
  )`,3:`oklch(
    from var(--color-orange-2) calc(l * 0.53) var(--chroma-3, 0.2) h
  )`,4:`oklch(
    from var(--color-orange-2) calc(l * 0.27) var(--chroma-4, 0.12) h
  )`,5:`oklch(
    from var(--color-orange-2) calc(l * 0.14) var(--chroma-4, 0.08) h
  )`},gray:{0:"oklch(98% var(--chroma-gray, none) var(--hue-gray, none))",1:"oklch(94% var(--chroma-gray, none) var(--hue-gray, none))",2:`oklch(
    var(--lightness, 67%) var(--chroma-gray, none) var(--hue-gray, none)
  )`,3:"oklch(49% var(--chroma-gray, none) var(--hue-gray, none))",4:"oklch(32% var(--chroma-gray, none) var(--hue-gray, none))",5:"oklch(25% var(--chroma-gray, none) var(--hue-gray, none))",6:"oklch(18% var(--chroma-gray, none) var(--hue-gray, none))",7:"oklch(10% var(--chroma-gray, none) var(--hue-gray, none))"},ivory:{0:"oklch(98% var(--chroma-ivory, none) var(--hue-ivory, none))",1:"oklch(97% var(--chroma-ivory, none) var(--hue-ivory, none))",2:`oklch(
    var(--lightness, 67%) var(--chroma-ivory, none) var(--hue-ivory, none)
  )`,3:"oklch(49% var(--chroma-ivory, none) var(--hue-ivory, none))",4:"oklch(32% var(--chroma-ivory, none) var(--hue-ivory, none))",5:"oklch(25% var(--chroma-ivory, none) var(--hue-ivory, none))",6:"oklch(18% var(--chroma-ivory, none) var(--hue-ivory, none))",7:"oklch(10% var(--chroma-ivory, none) var(--hue-ivory, none))"}},font:{fallback:`inter, "Hiragino Kaku Gothic ProN", system-ui, "Segoe UI",
    roboto, helvetica, arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
    "Segoe UI Symbol"`,family:{inter:"inter",operator:'"Operator Mono Lig", monospace'}}},o={tokens:r};export{o as t};
