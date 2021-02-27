const {ccclass, property} = cc._decorator;
@ccclass
export default class raw extends cc.Component{
    @property(cc.SpriteFrame)
    spf:cc.SpriteFrame = null;
    
    start(){
        let xIndex = 2;
        let yIndex = 2;
        let spr =  this.node.getComponent(cc.Sprite);
        let spf = spr.spriteFrame;
        spr.spriteFrame = null;
        spf.setRect(cc.rect(60,60,60*xIndex,60*yIndex));
        spr.spriteFrame = spf;
    }
}