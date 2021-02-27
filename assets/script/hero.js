
cc.Class({
    extends: cc.Component,

    properties: {
        audio_b:{//碰到黑块的声音
            type:cc.AudioClip,
            default:null
        },
        audio_w:{
            type:[cc.AudioClip],
            default:[]
        },
        audio_xpj:{
            type:[cc.AudioClip],
            default:[]
        },
    },

    onLoad () {
        cc.log('hero onLoad')
        this.node.getComponent(cc.RigidBody).enabledContactListener = true
    },

    // 只在两个碰撞体结束接触时被调用一次
    onEndContact: function (contact, selfCollider, otherCollider) {
        if(!selfCollider.node.active){
            return;
        }
        //cc.log('只在两个碰撞体结束接触时被调用一次')
        if (otherCollider.tag == 0) {//白块或橡皮筋
            otherCollider.node.active = false
            otherCollider.node.scale = 0.8
            var pos = otherCollider.node.getPosition()
            var w_tx = otherCollider.node.width
            var h_tx = otherCollider.node.height
            var str_type_tx = otherCollider.node.getComponent(cc.Sprite).spriteFrame._name //0-5是白块  6是橡皮筋
            var i_type_tx = parseInt(str_type_tx)
            var angle_tx = otherCollider.node.angle
            game.createTx(i_type_tx,pos,w_tx,h_tx,angle_tx)
            game.cleanDian()
            cc.log(i_type_tx)
            if (game.pdSuccess()) {
                //game.nextLevel()
                cc.log('过关了！！')
            }

            if (i_type_tx < 6) {//白块
                game.i_audio_w++
                if (game.i_audio_w > 7) {
                    game.i_audio_w = 0
                }
                cc.audioEngine.play(this.audio_w[game.i_audio_w], false, 1)
            }else{//橡皮筋
                game.i_audio_xpj++
                if (game.i_audio_xpj > 7) {
                    game.i_audio_xpj = 0
                }
                cc.audioEngine.play(this.audio_xpj[game.i_audio_xpj], false, 1)
            }
            

        }else if (otherCollider.tag == 10) {//黑块
            cc.audioEngine.play(this.audio_b, false, 1)
            game.cleanDian()
            otherCollider.node.stopAllActions()
            var act_1 = cc.scaleTo(0.03,0.96)
            var act_2 = cc.scaleTo(0.06,1.04)
            var act_3 = cc.scaleTo(0.003,1)
            var end = cc.sequence(act_1,act_2,act_3)
            otherCollider.node.runAction(end)
        }else if(otherCollider.tag == 20 && game.can_tw){//用于瞄准的小球
            otherCollider.node.active = false
        }
        
        
    },

    start () {

    },

    // update (dt) {},
});
