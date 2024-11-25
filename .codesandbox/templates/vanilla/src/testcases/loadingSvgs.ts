import * as fabric from 'fabric';

const svgString = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg" viewBox="5 3 10 10" version="1.1" width="400" height="400">
<g>
    <g>
    <clipPath id="a">
        <circle transform="scale(1.2, 1.2) translate(-1, -1)"  r="4"  cx="8" cy="8" />
    </clipPath>
    <clipPath id="t" clip-path="url(#a)">
        <circle r="6" transform="scale(1.3, 0.8) translate(1, 1)"  cx="7" cy="7" />
    </clipPath>
    <clipPath id="c" clip-path="url(#t)" >
        <circle  transform="translate(12, 10) scale(14, 14)"  r="0.5"  cx="0.01" cy="0.01" />
    </clipPath>
<path clip-path="url(#c)" d="M15.422,18.129l-5.264-2.768l-5.265,2.768l1.006-5.863L1.64,8.114l5.887-0.855
	l2.632-5.334l2.633,5.334l5.885,0.855l-4.258,4.152L15.422,18.129z" fill="red"/>
    </g>
</g>
</svg>`;

export async function testCase(canvas: fabric.Canvas) {
  const svg = await fabric.loadSVGFromString(svgString);
  canvas.add(...(svg.objects.filter((obj) => !!obj) as fabric.FabricObject[]));
}
