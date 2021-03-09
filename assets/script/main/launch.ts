import ball from "./ball";
import tip from "./tip";

const {ccclass, property} = cc._decorator;
@ccclass
export default class launch extends cc.Component{
    @property(cc.Prefab)
    ballItem:cc.Prefab = null;

    @property(tip)
    tip:tip = null;

    ballPool:cc.NodePool = null;
    currentBallNode:cc.Node = null;
    onLoad(){
        this.ballPool = new cc.NodePool();
        this.scheduleOnce(()=>{
            this.getBallNode();
        })
    }

    nextBallSize:number = null;
    getBallNode(){
        let ballNode:cc.Node = null;
        if(this.ballPool.size()>0){
            ballNode = this.ballPool.get();
        }else{
            ballNode = cc.instantiate(this.ballItem);
        }
        if(!ballNode.parent){
            ballNode.parent = this.node;
        }
        ballNode.scale = 1;
        ballNode.setPosition(0,0);
        ballNode.getComponent(cc.RigidBody).type = cc.RigidBodyType.Static;
        ballNode.getComponent(cc.RigidBody).linearVelocity = cc.v2(0,0);
        let size = this.getRandomSize();
        if(this.nextBallSize){
            size = this.nextBallSize;
        }
        ballNode.getComponent(ball).size = size;
        this.nextBallSize = this.getRandomSize();
        this.tip.num = Math.pow(2,this.nextBallSize);
        ballNode.getComponent(ball).endCallback = (target:cc.Node)=>{
            this.ballPool.put(target);
        }
        this.currentBallNode = ballNode;
        return ballNode;
    }

    hideAllBall(){
        this.node.children.forEach((child:cc.Node)=>{
            cc.tween(child)
            .to(0.5,{scale:0})
            .call(()=>{
                child.active = false;
                child.getComponent(ball).addScoreCallback();
                this.ballPool.put(child);
            })
            .start();
        })
    }

    getRandomSize(){
        return Math.floor(Math.random()*3+1);
    }

}