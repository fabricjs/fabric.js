import { useEffect, useState } from 'react';

export const generateExample = (codeFunc, id, codeAsString) => {
    return ({ hideCode, canvasStyle, hideCanvas }) => {
        const [codestring, setCode] = useState()
        useEffect(() => {
            hideCanvas || codeFunc(id);
            const code = codeAsString ?? codeFunc.toString();
            const matching = code.match(/function[^{]+\{\n([\s\S]*)\}$/);
            setCode(matching?.[1] || code);
        }, []);
        return <>
            {hideCode || 
                (<pre style={{overflowX: 'scroll'}}>
                    <code>{codestring}</code>
                </pre>)
            }
            {hideCanvas ||
                (<div style={canvasStyle} >
                    <canvas width="400" height="300" id={id} />
                </div>)
            }
        </>
    }
}