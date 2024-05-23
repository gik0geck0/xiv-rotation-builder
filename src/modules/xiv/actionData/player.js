const jobType = Object.freeze({
    Paladin, Warrior, DarkKnight, Gunbreaker, WhiteMage, Scholar, Astrologian, Sage, Monk, Dragoon, Ninja, Samurai, Reaper, Bard, Machinist, Dancer, BlackMage, Summoner, RedMage
})

class Player{
    constructor(job, mp, gaugeTotals){
        this.job = job
        this.mp = mp
        this.maxMp = mp //Always going to start with full mp so that is the max
        this.gaugeTotals = gaugeTotals //Should be an array of each gauge, each position will contain (name, amount)
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

    restoreMP(){
        this.mp = this.maxMp
    }

    getGaugeTotals(){
        return this.gaugeTotals
    }

    changeGaugeTotals(gaugeChange){

    }
}