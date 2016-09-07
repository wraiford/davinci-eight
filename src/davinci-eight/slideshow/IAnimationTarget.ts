import {Shareable} from '../core/Shareable';

interface IAnimationTarget extends Shareable {
    getPropertyFormats(name: string): string[];
    getProperty(name: string, format: string): any;
    setProperty(name: string, format: string, value: any): void;
}

export default IAnimationTarget;
