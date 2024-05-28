const jobType = Object.freeze({
    Paladin, Warrior, DarkKnight, Gunbreaker, WhiteMage, Scholar, Astrologian, Sage, Monk, Dragoon, Ninja, Samurai, Reaper, Bard, Machinist, Dancer, BlackMage, Summoner, RedMage
})

class Player{
    constructor(){
        this.job = null //Will be set by the user in the website
        this.mp = 10000
        this.gaugeTotals = [] //Contains values of {gaugeName : gaugeAmount}
        this.gaugeMaxs = gaugeTotals //Same values as gaugeTotals but unchanging 
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
        if (this.mp + mpChange > 10000){
            this.mp = 10000
        }
        else{
            this.mp += mpChange
        }
    }

    getGaugeTotals(){
        return this.gaugeTotals
    }

    changeGaugeTotals(gauge, gaugeAmount){
        gaugeTotals[gauge] += gaugeAmount;
    }
}