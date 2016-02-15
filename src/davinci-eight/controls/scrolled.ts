import G2 from '../math/G2'

function domElement(): HTMLElement {
    const documentElement = document.documentElement
    if (documentElement) {
        return documentElement
    }
    else {
        const body = document.body
        const html = body.parentNode
        if (html) {
            return <HTMLHtmlElement>html
        }
        else {
            return body
        }
    }
}

/**
 * A cross-browser compatible, geometric, implementation of scroolX and scrollY.
 *
 * See https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollX
 */
export default function(out: G2): void {
    out.α = 0
    out.xy = 0
    if (window.pageXOffset !== void 0 && window.pageYOffset !== void 0) {
        out.x = window.pageXOffset
        out.y = window.pageYOffset
    }
    else {
        const domE = domElement()
        out.x = domE.scrollLeft
        out.y = domE.scrollTop
    }
}
