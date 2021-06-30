import React from 'react'
// import mathjax
import { MathJax, MathJaxContext } from "better-react-mathjax";

class SettingPage extends React.Component {


    render() {
        return (
            <MathJaxContext>
                <h2>Basic MathJax example with Latex</h2>
                {/* <MathJax>{"\\(\\frac{10}{4x} \\approx 2^{12}\\)"}</MathJax> */}
                <MathJax>{"And that is \\( y_{n} + 2 \\) \\( - y _ { n } \\)"}</MathJax>
            </MathJaxContext>
        )
    }

}

export default SettingPage;