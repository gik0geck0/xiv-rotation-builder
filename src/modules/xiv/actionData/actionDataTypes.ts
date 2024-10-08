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
    comboBonus?: Record<string, any>;
    grants?: Record<string, any>;
    buffRequirement?: string;
    damageBuff?: number;
    durationPotency?: number;
    startTime?: number;
    timeTaken?: number;
}

export interface JobGuideJson {
    [jobName: string]: {
        gauges: Record<string, any>;
        actions: Action[];
        traits?: Record<string, any>[];
    };
}
