
export enum BallState{
    /**待发射状态 */
    none,
    /**已经发射状态 */
    launch
}

const widthSize = [];
const {ccclass, property} = cc._decorator;
@ccclass
export default class ball extends cc.Component{

    @property(cc.Label)
    lab:cc.Label = null;

    _size:number = 2;

    get size(){
        return this._size;
    }

    set size(val:number){
        if (!this.node.parent) return;
        this._size = val;
        this.lab.string = `${Math.pow(2,this.size)}`;
        this.lab.lineHeight = 40 + (this.size-1)*8;
        this.lab.fontSize = 30 + (this.size-1)*8;
        this.node.width = 40 + 20* this._size;
        this.node.height = 40 + 20* this._size;
        this.node.getComponent(cc.PhysicsCircleCollider).radius = this.node.width/2;
        this.node.getComponent(cc.PhysicsCircleCollider).apply();
    }

    endCallback:(target:cc.Node)=>void;

    start(){
    }
    
    onLoad(){
        this.node.getComponent(cc.RigidBody).enabledContactListener = true;
        // cc.director.getPhysicsManager().debugDrawFlags = cc.PhysicsManager.DrawBits.e_aabbBit |
        // cc.PhysicsManager.DrawBits.e_pairBit |
        // cc.PhysicsManager.DrawBits.e_centerOfMassBit |
        // cc.PhysicsManager.DrawBits.e_jointBit |
        // cc.PhysicsManager.DrawBits.e_shapeBit;
    }

    onBeginContact(contact, selfCollider:cc.PhysicsCircleCollider, otherCollider:cc.PhysicsCircleCollider) {
        let selfBallCom = selfCollider.node.getComponent(ball);
        let otherBallCom = otherCollider.node.getComponent(ball);
        if(otherCollider.tag == 0){

        }else if(otherCollider.tag == 1){
            // cc.log(selfBallCom.size,otherBallCom.size);
            if(selfCollider.node.y > otherCollider.node.y){

            }else if(selfCollider.node.y < otherCollider.node.y){

            }
        }
    }

    onPreSolve(contact:cc.PhysicsContact, selfCollider:cc.PhysicsCircleCollider, otherCollider:cc.PhysicsCircleCollider) {
        let selfBallCom = selfCollider.node.getComponent(ball);
        let otherBallCom = otherCollider.node.getComponent(ball);
        if(otherCollider.tag == 0){

        }else if(otherCollider.tag == 1 && selfBallCom.size == otherBallCom.size){
            if(selfCollider.node.y > otherCollider.node.y){
                contact.disabled = true;
                this.endCallback(otherCollider.node);
                this.addScoreCallback();
                this.size += 1;
                if(this.size == 11){//11
                    cc.director.emit("playEffect");
                }
            }else{

            }
        }
    }

    addScoreCallback(){
        cc.director.emit("addScore",{addScore:5*this.size,target:this.node});
    }

    update(){
        this.lab.node.angle = -this.node.angle;
    }

}