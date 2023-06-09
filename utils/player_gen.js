const fs = require('fs');

const player_default_svg = `<svg width="58px" height="64px" viewBox="-15.593 29.388 157.012 206.725" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:bx="https://boxy-svg.com">
<defs>
  <linearGradient gradientUnits="userSpaceOnUse" x1="63.235" y1="173.067" x2="63.235" y2="207.603" id="gradient-0">
    <stop offset="0" style="stop-color: rgba(94, 94, 94, 1)"></stop>
    <stop offset="1" style="stop-color: rgba(43, 43, 43, 1)"></stop>
  </linearGradient>
  <linearGradient id="gradient-2" bx:pinned="true">
    <stop style="stop-color: rgb(206, 253, 250);" offset="0"></stop>
    <stop offset="0.479" style="stop-color: rgba(0, 242, 255, 0.47);"></stop>
    <stop style="stop-color: rgba(0, 145, 153, 0);" offset="1"></stop>
  </linearGradient>
  <radialGradient id="gradient-2-0" gradientUnits="userSpaceOnUse" cx="63.445" cy="211.31" r="15.813" gradientTransform="matrix(1.166668, 0, 0, 1.709669, -10.867077, -154.06053)" xlink:href="#gradient-2"></radialGradient>
</defs>
<ellipse style="fill: url(#gradient-2-0);opacity: 0.999" cx="63.153" cy="207.211" rx="18.449" ry="31.041"></ellipse>
<rect x="-3.425" y="60.606" width="8.095" height="40.473" style="fill: rgb(216, 216, 216); stroke: rgb(0, 0, 0);"></rect>
<rect x="121.769" y="60.127" width="8.095" height="40.473" style="fill: rgb(216, 216, 216); stroke: rgb(0, 0, 0);"></rect>
<rect x="45.487" y="173.067" width="35.496" height="34.536" style="stroke: rgb(0, 0, 0); fill: url(#gradient-0);"></rect>
<rect x="-12.454" y="99.211" width="151.307" height="25.529" style="stroke: rgb(0, 0, 0); fill: rgb(83, 83, 83);"></rect>
<path d="M 63.201 33.724 L 109.589 114.155 L 16.812 114.155 L 63.201 33.724 Z" style="stroke: rgb(0, 0, 0); fill: rgb(112, 112, 112);" bx:shape="triangle 16.812 33.724 92.777 80.431 0.5 0 1@3fc5ff12"></path>
<path d="M 63.2 76.795 L 110.872 114.442 L 92.663 175.356 L 33.737 175.356 L 15.528 114.442 Z" style="stroke: rgb(0, 0, 0); fill: rgb(213, 47, 47);" bx:shape="n-gon 63.2 131.278 50.125 54.483 5 0 1@f2bb4b28"></path>
<path d="M 63.824 95.107 L 96.324 119.935 L 83.91 160.107 L 43.738 160.107 L 31.324 119.935 Z" style="stroke: rgb(0, 0, 0); fill: rgb(88, 88, 88);" bx:shape="n-gon 63.824 131.038 34.172 35.931 5 0 1@dd241e49"></path>
</svg>
`

//list out all primary colors

const colors = [
    ["red", "rgb(213, 47, 47)"],
    ["pink", "rgb(240, 98, 146)"],
    ["purple", "rgb(142, 36, 170)"],
    ["deep-purple", "rgb(94, 53, 177)"],
    ["indigo", "rgb(64, 81, 181)"],
    ["blue", "rgb(25, 118, 210)"],
    ["light-blue", "rgb(2, 136, 209)"],
    ["cyan", "rgb(0, 151, 167)"],
    ["teal", "rgb(0, 121, 107)"],
    ["green", "rgb(56, 142, 60)"],
    ["light-green", "rgb(104, 159, 56)"],
    ["lime", "rgb(175, 180, 43)"],
    ["yellow", "rgb(251, 192, 45)"],
    ["amber", "rgb(255, 160, 0)"],
    ["orange", "rgb(255, 87, 34)"],
    ["deep-orange", "rgb(244, 81, 30)"],
    ["brown", "rgb(121, 85, 72)"],
    ["grey", "rgb(158, 158, 158)"],
    ["blue-grey", "rgb(96, 125, 139)"]
]

colors.forEach((color) => {
    if (color=="red") return;
    let svg_out = player_default_svg.replace("rgb(213, 47, 47)", color[1]);
    fs.writeFileSync("./webapp/public/svg/player_"+color[0]+".svg", svg_out);
})