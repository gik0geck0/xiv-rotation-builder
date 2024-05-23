import player from 'xiv/actionData';

class Paladin extends Player(){
    constructor(){
        super();
        this.DivineMight = false
        this.Requiescat = false
        this.ConfiteorReady = false
    }

    setDivineMight(bool){
        this.DivineMight = bool
    }
    
    underDivineMight(){
        return this.DivineMight
    }

    setRequiescat(bool){
        this.Requiescat = bool
    }

    underRequiescat(){
        return this.Requiescat;
    }

    setConfiteorReady(bool){
        this.ConfiteorReady = bool
    }
}