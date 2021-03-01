import launch from "./launch";
import LoadingIndicator from "./turnaround";
import turnaround from "./turnaround";

const {ccclass, property} = cc._decorator;
@ccclass
export default class main extends cc.Component{

    @property(launch)
    launchCom:launch = null;

    @property(cc.Node)
    miaozhun:cc.Node = null;

    @property(cc.Prefab)
    effect:cc.Prefab = null;

    onLoad(){
        cc.director.on("playEffect",this.playEffect.bind(this));

        this.node.on(cc.Node.EventType.TOUCH_START,this.touchStart.bind(this),this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE,this.touchMove.bind(this),this);
        this.node.on(cc.Node.EventType.TOUCH_END,this.touchEnd.bind(this),this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL,this.touchEnd.bind(this),this);
        cc.director.getPhysicsManager().gravity = cc.v2(0, -800)
        this.node.getChildByName("left2").skewY = 44;
        this.node.getChildByName("right2").skewY = -44;
        this.scheduleOnce(()=>{
            let leftNode = this.node.getChildByName("left");
            let rightNode = this.node.getChildByName("right");
            let bottomNode = this.node.getChildByName("bottom");
            leftNode.getComponent(cc.PhysicsBoxCollider).size.height = leftNode.height;
            rightNode.getComponent(cc.PhysicsBoxCollider).size.height = rightNode.height;
            bottomNode.getComponent(cc.PhysicsBoxCollider).size.width = bottomNode.width;
            leftNode.getComponent(cc.PhysicsBoxCollider).apply();
            rightNode.getComponent(cc.PhysicsBoxCollider).apply();
            bottomNode.getComponent(cc.PhysicsBoxCollider).apply();
        })
        
    }

    playEffect(){
        this.node.off(cc.Node.EventType.TOUCH_START);
        this.node.off(cc.Node.EventType.TOUCH_MOVE);
        this.node.off(cc.Node.EventType.TOUCH_END);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL);
        this.unscheduleAllCallbacks();
        let effectNode = cc.instantiate(this.effect);
        effectNode.parent = this.node;
        effectNode.y = -350;
        this.miaozhun.active = false;
        this.scheduleOnce(()=>{
            this.launchCom.hideAllBall();
        },2)
    }  

    touchMove(event:cc.Event.EventTouch){
        this.setBallPos(event);
    }

    touchStart(event:cc.Event.EventTouch){
        this.setBallPos(event);
    }

    touchEnd(event:cc.Event.EventTouch){
        if(!this.launchCom.currentBallNode){
            return;
        }
        this.setBallPos(event);
        this.launchCom.currentBallNode.getComponent(cc.RigidBody).type = cc.RigidBodyType.Dynamic;
        this.launchCom.currentBallNode.getComponent(cc.RigidBody).linearVelocity = cc.v2(0,-600);
        this.launchCom.currentBallNode.removeComponent(turnaround);
        this.launchCom.currentBallNode = null;
        this.miaozhun.active = false;
        this.scheduleOnce(()=>{
            this.miaozhun.active = true;
            this.miaozhun.x = 0;
            this.launchCom.getBallNode();
        },1)
    }

    setBallPos(event:cc.Event.EventTouch){
        if(!this.launchCom.currentBallNode){
            return;
        }
        let nodePos = this.node.convertToNodeSpaceAR(event.getLocation());
        let posX = this.node.width/2 - this.node.getChildByName("left").width - this.launchCom.currentBallNode.width/2-2;
        if(nodePos.x>posX || nodePos.x<-posX){
            let worldPos = this.node.convertToWorldSpaceAR(cc.v2(posX,0))
            nodePos.x<-posX && ( worldPos = this.node.convertToWorldSpaceAR(cc.v2(-posX,0)) )
            let spacePos = this.launchCom.node.convertToNodeSpaceAR(worldPos);
            this.launchCom.currentBallNode.setPosition(spacePos.x,0);
            this.miaozhun.x = spacePos.x;
        }else{
            let spacePos = this.launchCom.node.convertToNodeSpaceAR(event.getLocation());
            this.launchCom.currentBallNode.setPosition(spacePos.x,0);
            this.miaozhun.x = spacePos.x;
        }
    }

}