import * as fabric from 'fabric';

const makePath = (textObj): string => {
  const diameter = 300; // Circle diameter
  const radius = diameter / 2; // Convert diameter to radius
  const arcAngle = 360; // Angle covered by the arc
  const startAngle = 0; // Starting angle for the text (X start point)

  const charCount = textObj.text.length; // Number of characters in the text

  // Calculate the angle between each character
  const anglePerChar = arcAngle / (charCount - 1);

  // Adjust the startAngle by subtracting 90° to shift the starting point to the top (12 o'clock)
  let angle = startAngle + 90;

  // Construct the path, starting from the first character's position
  let pathString = `M ${radius * Math.cos((angle * Math.PI) / 180)} ${
    radius * Math.sin((angle * Math.PI) / 180)
  }`;

  // Loop through each character and add to the path
  for (let i = 0; i < charCount; i++) {
    const theta = (angle * Math.PI) / 180; // Convert angle to radians
    const xPos = radius * Math.cos(theta); // Calculate x position
    const yPos = radius * Math.sin(theta); // Calculate y position

    // Add arc segment for each letter
    pathString += ` A ${radius} ${radius} 0 0 1 ${xPos} ${yPos}`;

    // Increment the angle for the next character
    angle += anglePerChar;
  }

  return pathString;
};

export function testCase(canvas: fabric.Canvas) {
  fabric.config.NUM_FRACTION_DIGITS = 9;
  const textValue = 'ABCDEFGHIL';
  const text = new fabric.FabricText(textValue, {
    width: 200,
    top: 20,
    fill: 'green',
    stroke: 'red',
    objectCaching: true,
    textDecorationTickness: 0.06667,
    underline: true,
    overline: true,
    linethrough: true,
    styles: {
      0: {
        0: {
          fontSize: 60,
          fill: 'blue',
        },
        1: {
          fontSize: 60,
          textDecorationTickness: 0.15,
        },
        2: {
          fontSize: 40,
          fill: 'blue',
        },
        3: {
          fontSize: 40,
          textDecorationTickness: 0.03,
        },
      },
    },
  });
  const pathString = makePath(text);
  const pathObject = new fabric.Path(pathString, {
    fill: 'transparent',
    stroke: 'red',
    objectCaching: false,
  });
  // text.set('path', pathObject);
  canvas.add(text);
  canvas.centerObjectH(text);
}
