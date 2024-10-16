export default {
    "customActions": {
        "filler": {
            "description": "Any GCD",
            "type": "pick",
            "icon": "tbd",
            "options": ["Atonement", "Holy Spirit", "Royal Authority"]
        },
        "magic-plus": {
            "description": "Some new magic combo action in 7.0",
            "type": "action",
            "icon": "tbd"
        }
    },
    "snippets": [
        {
            "name": "balanceOpener",
            "description": "Standard Opener for raids from The Balance",
            "versions": [
                {
                    "name": "v0",
                    "description": "State of PLD in 6.55",
                    "actions": [
                        {
                            "time": -2.0,
                            "action": "Holy Spirit"
                        },
                        {
                            "action": "Fast Blade"
                        },
                        {
                            "action": "Tincture"
                        },
                        {
                            "action": "Riot Blade"
                        },
                        {
                            "action": "Royal Authority"
                        },
                        {
                            "action": "Fight or Flight"
                        },
                        {
                            "action": "Requiescat"
                        },
                        {
                            "action": "Goring Blade"
                        },
                        {
                            "action": "Circle of Scorn"
                        },
                        {
                            "action": "Expiacion"
                        },
                        {
                            "action": "Confiteor"
                        },
                        {
                            "action": "Intervene"
                        },
                        {
                            "action": "Blade of Faith"
                        },
                        {
                            "action": "Intervene"
                        },
                        {
                            "action": "Blade of Truth"
                        },
                        {
                            "action": "Blade of Valor"
                        },
                        {
                            "action": "Holy Spirit"
                        },
                        {
                            "action": "Atonement"
                        },
                        {
                            "action": "Atonement"
                        },
                        {
                            "action": "Atonement"
                        }
                    ]
                }
            ]
        },
        {
            "name": "BalanceRotation",
            "description": "Default set when waiting for other cooldowns",
            "versions": [
                {
                    "name": "v0",
                    "actions": [
                        {
                            "shortcut": "123"
                        },
                        {
                            "shortcut": "Atonements"
                        },
                        {
                            "shortcut": "Holy Spirit"
                        }
                    ]
                }
            ]
        },
        {
            "name": "BalanceBurst",
            "description": "Standard 1-min after opener",
            "versions": [
                {
                    "name": "v0",
                    "actions": [
                        {
                            "action": "Fight or Flight"
                        },
                        {
                            "action": "Requiescat"
                        },
                        {
                            "action": "Goring Blade"
                        },
                        {
                            "action": "Circle of Scorn"
                        },
                        {
                            "action": "Expacion"
                        },
                        {
                            "action": "Confiteor"
                        },
                        {
                            "action": "Intervene"
                        },
                        {
                            "action": "Blade of Faith"
                        },
                        {
                            "action": "Intervene"
                        },
                        {
                            "action": "Blade of Truth"
                        },
                        {
                            "action": "Blade of Valor"
                        },
                        {
                            "action": "filler"
                        },
                        {
                            "action": "filler"
                        },
                        {
                            "action": "filler"
                        }
                    ]
                }
            ]
        },
        {
            "name": "12",
            "description": "shorthand for 1-2 combo",
            "versions": [
                {
                    "name": "v0",
                    "actions": [
                        {
                            "action": "Fast Blade"
                        },
                        {
                            "action": "Riot Blade"
                        }
                    ]
                }
            ]
        },
        {
            "name": "123",
            "description": "shorthand for 1-2-3 combo",
            "actions": [
                {
                    "shortcut": "12"
                },
                {
                    "action": "Royal Authority"
                }
            ]
        },
        {
            "name": "Atonements",
            "description": "use all the atonements",
            "versions": [
                {
                    "name": "v0",
                    "actions": [
                        {
                            "action": "Atonement"
                        },
                        {
                            "action": "Atonement"
                        },
                        {
                            "action": "Atonement"
                        }
                    ]
                }
            ]
        },
        {
            "name": "Magic Combo",
            "description": "Start and run magic combo",
            "actions": [
                {
                    "action": "Requiescat"
                },
                {
                    "action": "Confiteor"
                },
                {
                    "action": "Blade of Faith"
                },
                {
                    "action": "Blade of Truth"
                },
                {
                    "action": "Blade of Valor"
                }
            ]
        }
    ]
}
