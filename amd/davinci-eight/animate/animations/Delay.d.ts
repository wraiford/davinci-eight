import IAnimation = require('../../animate/IAnimation');
import IAnimationClock = require('../../animate/IAnimationClock');
import IProperties = require('../../animate/IProperties');
import Shareable = require('../../utils/Shareable');
declare class Delay extends Shareable implements IAnimation {
    private host;
    object: IProperties;
    key: string;
    start: number;
    duration: number;
    fraction: number;
    constructor(host: IAnimationClock, object: IProperties, key: string, duration: number);
    protected destructor(): void;
    private init(offset?);
    apply(offset?: number): void;
    skip(): void;
    hurry(factor: number): void;
    extra(): number;
    done(): boolean;
}
export = Delay;
