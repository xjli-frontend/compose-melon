const {ccclass, property} = cc._decorator;
@ccclass
export default class timer extends cc.Component{

    @property(cc.Label)
    lab:cc.Label = null;

    starTimes:number = new Date().getTime();
    onLoad(){
        this.schedule(()=>{
            let cutDownTimes = new Date().getTime()-this.starTimes;
            this.lab.string = this.formatTime(cutDownTimes);
        },1);
    }


    /**显示时间字符串 00:00:00 */
    public formatTime(ms,isHour:boolean=true) {  
        if(ms<=0){
            return `${isHour?"00:":""}00:00`;  
        }
        let ss = 1000;  
        let mi = ss * 60;  
        let hh = mi * 60;  
        let dd = hh * 24;  
        
        let hour = Math.floor( ms / hh );  
        let _hour = "";
        if(hour<10){
            _hour = "0";
        }
        let minute = Math.floor( (ms - hour * hh) / mi );  
        let _minute = "";
        if(minute<10){
            _minute = "0";
        }
        let second = Math.floor( (ms - hour * hh - minute * mi) / ss );  
        let _second = "";
        if(second<10){
            _second = "0";
        }
        return `${isHour?`${_hour}${hour}:`:""}${_minute}${minute}:${_second}${second}`;  
    }  
}