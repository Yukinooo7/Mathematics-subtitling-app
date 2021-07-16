import React, { useEffect, useRef, useState } from 'react'


import { MathJax, MathJaxContext } from "better-react-mathjax";
export default function PreviewLatex(props) {
    const [latexContent, setLatexContent] = useState("")

    return (
        <div className="preview-latex-area"
            style={{ display: props.display }}>
            <h4 className='video_info_title'
            >Preview of LaTeX notations</h4>
            {/* <span>In order to show mathematics equation correctly, please make sure to use the following phrase in the subtitles.</span> */}
            <h4 id='latex_input_title'>Math equation input area: </h4>
            <textarea className="input-math-area"
                value={latexContent}
                onChange={(event) => {
                    // console.log(event.target.value)
                    setLatexContent(event.target.value)
                }}>
            </textarea>

            <h4 id='latex_input_title'>LaTeX Result: </h4>

            <div className="latex-show-area">
                <MathJaxContext version={3}>

                    <MathJax inline dynamic>
                        <div style={{ width: '80%', height: '20%', backgroundColor: 'white', overflow: 'scroll' }}>{`\\( ${latexContent} \\)`}</div>
                    </MathJax>{" "}

                </MathJaxContext>

            </div>

        </div>
    )
}