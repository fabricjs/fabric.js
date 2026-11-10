import * as fabric from 'fabric';

const svgString = `<?xml version="1.0" encoding="UTF-8"?>
<svg version="1.1" width="400px" height="400px" viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg">
    <defs>
        <clipPath id="multiShape">
            <circle cx="30" cy="30" r="25" />
            <rect x="50" y="10" width="40" height="40" />
        </clipPath>
    </defs>

    <g clip-path="url(#multiShape)">
        <g clip-path="url(#multiShape)" transform="scale(0.8)">
            <rect
                width="100"
                height="100"
                fill="purple"
            />
            <circle cx="100" cy= "50" r="50" fill="orange" />
            <g transform="scale(0.8) translate(20, 10)" >
                <rect clip-path="url(#multiShape)" transform="scale(0.8)"
                    x="20"
                    y="20"
                    width="100"
                    height="100"
                    fill="red"
                />
            </g>
        </g>
    </g>
</svg>`;

export async function testCase(canvas: fabric.Canvas) {
  const svg = await fabric.loadSVGFromString(svgString);
  canvas.add(...(svg.objects.filter((obj) => !!obj) as fabric.FabricObject[]));
}
