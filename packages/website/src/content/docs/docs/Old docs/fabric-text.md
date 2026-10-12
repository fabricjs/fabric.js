---
date: '2017-08-11'
description: 'Fabric.js Text'
title: Fabric.js Text
---

### An introduction to fabricjs Text 2.0

With fabric 2.0 text got a major lift up. A huge work.

*   fabric.Text took the IText only styling abilities, IText is now just an interactive layer over text.
*   Multibyte support. That means better internalization support and emoji.
*   Kerning support. ( kerning was not available with subranges )
*   Composition support for languages that requires it ( Chinese, Japanese at least )
*   Better handling of input in general ( macosx long press support for example )

![](/article_assets/textsample.png)

This is an high level introduction of the internal process of rendering a text in fabric.js.  
If you want to develop your own text feature, you should read this page, to get an idea of what is going on before dig in to the js files following the code.  
There are 2 main topic i would like to talk about, measuring the text and rendering it on the canvas element.

### Measuring the text size

So we give fabric a text string, some per character styles and properties, and we get a nice colored, formatted text.  
The first thing fabric has to do is measure the bounding box of this text.  

#### Getting the lines

The first step is `_splitTextIntoLines,` fabric divides the text in lines ( searching for the newLine char ), and split text into graphemes. If you do not know what are graphemes, make a pause, search on internet and get it clear.  
The graphemeSplit function is made to be overridden. The grapheme list in unicode is enormous, there are thousands multibyte char for emojis, asian languages, hindi, diatrical marks and so on. Is not fabric job to make this kind of splitting, so we provided a basic function in `fabric.util.graphemeSplit` that you can override with the one that supports your specific use case.  

#### Getting the lines width

So now we have an array of text lines and we should find out how long they are.  
The `HTMLCanvasElement` provide us a `measureText` method that will tell us how large is a char, with cross browser differences as in web best tradition.  
This measurement is expensive since it involves analyzing the gliphs of text (i have the impression that IE just paints the text and count the pixels...), so each charcter encounterd gets measured with measureText and the result gets saved in a cache object with a per font per style key.  
I try to make a clear example:  
Let's take the text \`Fabricjs\`, in arial 40px no italic, no bold.  
We take 'F', we measure it at 200px font size. we get a number for the width, 100.  
Then we take 'a', we measure it at 200px, we get a number for the width, 90.  
We measure also 'Fa' at 200px and we get surpise 185.  
That means that the font arial has some kerning information for the Fa couple and we want to respect it, so we take note.  
We continue the process for 'b', 'ab', 'r', 'br', 'i', 'ri', 'c', 'ic'.. till the end of text.  
During this process, we populate the `fabric.charsWidthCache` with a set of sub properties and objects:  

```
- charsWidthCache
  - arial_normal_normal
    - F: 100
    - a: 90
    - Fa: 185
    - b: 90
    - ab: 180
  - arial_bold_normal
```
Now those information gets saved in this organized cache so that the next time we find the same couple or the same char, we just retrieve the information and we do not have to measure again.  
We measure at 200px because the ms family of browsers is giving back rounded results and this was causing rounding errors in cursor placements when the canvas or text were scaled. by much.  
We only measure at one size. we assume that a font gliph at size 100 is double wide than one at size 50. This assumption works for us and gives us the ability to measure a gliph only once.  
So we get a glyph width and couple width, by difference we know how large is that char near the preceding one. We take note of everything in an array of bounding boxes for our text. In those boxes we save what we call the `width` and the `kernedWidth` of that character.

#### adding charspacing

if we have some charspacing ( positive or negative ) that number get added to both width and kernedWith in the glyph bounding box.

#### text decoration

Before `textDecoration` was a string containing a list of space separated values of \`underline\` `overline` and `strikethorugh`  
Each of this options now got a boolean and textDecoration property is gone.

```ts
  var myText = new fabric.Text('fabric 2.0', {
    underline: true,
    overline: true
  });
```