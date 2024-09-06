export interface GaugeDefinition {
    cap: number;
}

export interface GaugeCollection {
    [gaugeName: string]: GaugeDefinition;
}

export interface RawJobAction {
    icon: string;
    name: string;
    level: string;
    type: string;
    cast: string;
    recast: string;
    cost: string;
    effect: string;
}

export interface JobAction extends RawJobAction {
    id: string;
    location: string;
    errorMessage: string;
    description: string;
}

export interface RawJobTrait {
    icon: string;
    name: string;
    level: string;
    effect: string;
}

export interface RawJobDefinition {
    gauges: GaugeCollection;
    actions: RawJobAction[];
    traits: RawJobTrait[];
}
