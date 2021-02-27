const {ccclass, property} = cc._decorator;
@ccclass
export default class miaozhun extends cc.Component{

    @property(cc.Node)
    pointItem:cc.Node = null;

    onLoad(){
        this.pointPool = new cc.NodePool();
        this.pointPool.put(this.pointItem);
        this.initPoint();
    }

    initPoint(){
        let startY = - this.pointItem.height;
        let count = Math.floor(this.node.height/this.pointItem.height/2);
        for(let i=0;i<count;i++){
            let pointNode = this.getPointNode();
            let posY = startY + -this.pointItem.height*2*i;
            pointNode.y = posY;
            cc.tween(pointNode)
            .to((count-i)/2,{y:-this.node.height})
            .call(()=>{
                this.pointPool.put(pointNode);
                this.toBottom();
            })
            .start();
        }
    }

    toBottom(){
        let pointNode = this.getPointNode();
        pointNode.y = -30;
        let count = Math.floor(this.node.height/this.pointItem.height/2);
        cc.tween(pointNode)
        .to(count/2,{y:-this.node.height})
        .call(()=>{
            this.pointPool.put(pointNode);
            this.toBottom();
        })
        .start();
    }

    pointPool:cc.NodePool = null;
    getPointNode(){
        let pointNode:cc.Node = null;
        if(this.pointPool.size()>0){
            pointNode = this.pointPool.get();
        }else{
            pointNode = cc.instantiate(this.pointItem);
        }
        pointNode.parent = this.node;
        pointNode.active = true;
        return pointNode;
    }
}