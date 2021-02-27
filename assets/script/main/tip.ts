

const {ccclass, property} = cc._decorator;
@ccclass
export default class tip extends cc.Component{

    @property(cc.Label)
    lab:cc.Label = null;

    @property(cc.Node)
    point:cc.Node = null;

    set num(val:number){
        this.lab.string = `${val}`;
    }

    
    onLoad(){
        let initPosY = this.point.y;
        let act = ()=>{
            cc.tween(this.point)
            .to(0.8,{y:initPosY-2})
            .to(0.8,{y:initPosY+2})
            .call(()=>{
                act();
            })
            .start();
        }
        act();
    }

}