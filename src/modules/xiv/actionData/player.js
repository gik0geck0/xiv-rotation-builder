const jobType = Object.freeze({
    Paladin, Warrior, DarkKnight, Gunbreaker, WhiteMage, Scholar, Astrologian, Sage, Monk, Dragoon, Ninja, Samurai, Reaper, Bard, Machinist, Dancer, BlackMage, Summoner, RedMage
})

class Player{
    constructor(job, mp, gaugeTotals){
        this.job = job
        this.mp = mp
        this.maxMp = 10000 //Always going to start with full mp so that is the max Always going to be 10,000
        this.gaugeTotals = gaugeTotals //Should be an hashmap of each gauge, each position will contain (name, amount)
        this.gaugeMaxs = gaugeTotals
    }

    //General Getters and Setters
    getJob(){
        return this.job
    }

    setJob(newJob){
        this.job = newJob
    }

    getMP(){
        return this.mp
    }

    changeMP(mpChange){
        this.mp += mpChange
    }

    getGaugeTotals(){
        return this.gaugeTotals
    }

    changeGaugeTotals(gaugeChange){
        var gaugeName = gaugeChange[0]
        var gaugeChangeValue = gaugeChange[1]
    }
}