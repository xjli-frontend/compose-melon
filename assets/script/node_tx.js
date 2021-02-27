
cc.Class({
    extends: cc.Component,

    properties: {
        sp_tx:{
            type:cc.Sprite,
            default:null
        },
        spf_tx:{
            type:[cc.SpriteFrame],
            default:[]
        }
    },

    onLoad () {},

    init:function(type_tx,pos,w_tx,h_tx,angle_tx){//类型,坐标，宽，高,角度
        //this.node.getComponent(cc.Sprite).spriteFrame = this.spf_tx[type_tx]
        this.sp_tx.spriteFrame = this.spf_tx[type_tx]
        this.node.setPosition(pos)
        this.node.width = w_tx
        this.node.height = h_tx
        this.node.opacity = 255
        this.node.angle = angle_tx
        this.node.getComponent(cc.Sprite).type = cc.Sprite.Type.SLICED

        if (type_tx == 6) {//橡皮筋
            var anima = this.node.getComponent('cc.Animation')
            this.node.getComponent(cc.Sprite).type = cc.Sprite.Type.SIMPLE
            anima.play()
            anima.over = function(){
                this.node.removeFromParent()
            }
            return
        }



        this.node.scale = 1.1
        var act_1 = cc.scaleTo(0.4,1.3)
        var act_2 = cc.fadeOut(0.4,0)
        var act_3 = cc.spawn(act_1,act_2)
        var act_4 = cc.callFunc(function(){
            this.node.removeFromParent()
        },this)
        var end = cc.sequence(act_3,act_4)
        this.node.runAction(end)
        //cc.log('特效个数：'+this.node.parent.children.length)
    },

    start () {

    },

    update (dt) {},
});
