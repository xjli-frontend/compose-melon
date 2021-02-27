import ball from "./ball";

const {ccclass, property} = cc._decorator;
@ccclass
export default class score extends cc.Component{

    _score:number = 0;

    @property(cc.Label)
    lab:cc.Label = null;

    @property(cc.ProgressBar)
    progress:cc.ProgressBar = null;

    @property(cc.Label)
    progressLab:cc.Label = null;

    _level:number = 1;

    get level (){
        return this._level;
    }

    set level (val){
        this._level = val;
        this.progressLab.string = `lv.${val}`;
    }

    get score (){
        return this._score;
    }

    set score (val){
        this._score = val;
        this.lab.string = `${this._score}`;
        let num = val / this.getGearScore(this._level);
        this.progress.progress = num>=1?0:num;
        if(num >= 1){
            this.level += 1;
        }
        window["score"] = val;
    }

    effectPool:cc.NodePool = null;
    getEffectNode(){
        let effectNode:cc.Node = null;
        if(this.effectPool.size()>0){
            effectNode = this.effectPool.get();
        }else{
            effectNode = new cc.Node("anim");
            effectNode.addComponent(cc.Label);
        }
        effectNode.opacity = 255;
        return effectNode;
    }

    onLoad(){
        this.score = 0;
        this.level = 1;
        this.effectPool = new cc.NodePool();
        cc.director.on("addScore",this.addScore.bind(this));
    }

    addScore(params){
        if(typeof(params.addScore) == "number"){
            this.score+=params.addScore;
            this.addScoreAnim(params.addScore,params.target);
        }
    }

    getGearScore(level){
        return 100*Math.pow(level,2);
    }

    addScoreAnim(score,target:cc.Node){
        let effectNode = this.getEffectNode();
        let lab = effectNode.getComponent(cc.Label);
        let targetCom = target.getComponent(ball);
        lab.fontSize = targetCom.lab.fontSize;
        lab.lineHeight = targetCom.lab.lineHeight;
        lab.string = `+${score}`;
        effectNode.color = cc.Color.GREEN;
        effectNode.parent = this.node;
        let targetPos = target.parent.convertToWorldSpaceAR(target.getPosition());
        let spacePos = this.node.convertToNodeSpaceAR(targetPos);
        effectNode.setPosition(spacePos.x,spacePos.y+target.height/2);
        cc.tween(effectNode)
        .to(1,{opacity:0,y:spacePos.y+target.height})
        .call(()=>{
            this.effectPool.put(effectNode);
        })
        .start();
    }

    
}

window["score"] = 0;