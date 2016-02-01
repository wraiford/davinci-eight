import createGraphicsProgram from '../programs/createGraphicsProgram';
import IGraphicsProgram from '../core/IGraphicsProgram';
import IContextMonitor from '../core/IContextMonitor';
import MonitorList from '../scene/MonitorList';
import mustBeObject from '../checks/mustBeObject';
import mustBeString from '../checks/mustBeString';

// FIXME: Lists of scripts, using the type to distinguish vertex/fragment?

/**
 * Helper function for creating a <code>IGraphicsProgram</code> from HTML script element content.
 * Parameters:
 * monitors
 * vsId The vertex shader script element identifier.
 * fsId The fragment shader script element identifier.
 * domDocument The DOM document containing the script elements.
 * [attribs = []] The attribute indices (implied by order of the name in the array).
 */
export default function programFromScripts(monitors: IContextMonitor[], vsId: string, fsId: string, domDocument: Document, attribs: string[] = []): IGraphicsProgram {
    MonitorList.verify('monitors', monitors, () => { return "programFromScripts"; })
    mustBeString('vsId', vsId)
    mustBeString('fsId', fsId)
    // We have used a special  
    mustBeObject('domDocument', domDocument)

    // shortcut function for getElementById, capturing the domDocument parameter value (argument value).
    function $(id: string): HTMLElement {
        let element = domDocument.getElementById(mustBeString('id', id))
        if (element) {
            return element;
        }
        else {
            throw new Error(id + " is not a valid DOM element identifier.");
        }
    }

    let vertexShader: string = $(vsId).textContent;
    let fragmentShader: string = $(fsId).textContent;
    return createGraphicsProgram(monitors, vertexShader, fragmentShader, attribs);
}
