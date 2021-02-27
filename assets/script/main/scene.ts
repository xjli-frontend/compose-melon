const {ccclass, property} = cc._decorator;
@ccclass
export default class scene extends cc.Component{

    onLoad(){
        cc.director.getPhysicsManager().enabled = true;
    }

    //compose_melon


}