import ball from "./ball";

const {ccclass, property} = cc._decorator;
@ccclass
export default class launch extends cc.Component{
    @property(cc.Prefab)
    ballItem:cc.Prefab = null;

    ballPool:cc.NodePool = null;
    currentBallNode:cc.Node = null;
    onLoad(){
        this.ballPool = new cc.NodePool();
        this.scheduleOnce(()=>{
            this.getBallNode();
        })
    }

    getBallNode(){
        let ballNode:cc.Node = null;
        if(this.ballPool.size()>0){
            ballNode = this.ballPool.get();
        }else{
            ballNode = cc.instantiate(this.ballItem);
        }
        ballNode.parent = this.node;
        ballNode.scale = 1;
        ballNode.setPosition(0,0);
        ballNode.getComponent(cc.RigidBody).type = cc.RigidBodyType.Static;
        ballNode.getComponent(cc.RigidBody).linearVelocity = cc.v2(0,0);
        ballNode.getComponent(ball).size = this.getRandomSize();
        ballNode.getComponent(ball).endCallback = (target:cc.Node)=>{
            this.ballPool.put(target);
        }
        this.currentBallNode = ballNode;
        return ballNode;
    }

    getRandomSize(){
        return Math.floor(Math.random()*3+1);
    }

}