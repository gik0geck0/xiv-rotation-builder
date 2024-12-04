export interface Action {
    id?: string;
    icon: string;
    name: string;
    level: string;
    type: string;
    cast: string;
    recast: string;
    cost: string;
    effect: string;
    isInstant: boolean;
    isAbility: boolean;
    isSpell: boolean;
    isWeaponskill: boolean;
    description?: string;
    location?: string;
    errorMessage?: string;
    potency?: string;
    duration?: string;
    comboAction?: string;
    comboPotency?: string;
    comboBonus?: Record<string, string>;
    grants?: Record<string, string>;
    buffRequirement?: string;
    priorityBuff?: string;
    damageBuff?: number;
    durationPotency?: number;
    startTime?: number;
    timeTaken?: number;
    transformsFrom?: string;
    castNumeric?: number;
    recastNumeric?: number;
    durationNumeric?: number;
    potencyNumeric?: number;
    comboPotencyNumeric?: number;
    comboBonusNumeric?: Record<string, number>;
    grantsNumeric?: Record<string, number>;
}

export interface Buff {
    name: string;
    value: number;
    startTime: number;
    endTime: number;
};

export interface JobGuideJson {
    [jobName: string]: {
        gauges: Record<string, number>;
        actions: Action[];
        traits?: Record<string, string>[];
    };
}
