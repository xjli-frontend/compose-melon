
cc.Class({
    extends: cc.Component,

    properties: {
       hero:{
           type:cc.Node,
           default:null
       },
       node_level:{
            type:cc.Node,
            default:null
       },
       pre_tx:{
           type:cc.Prefab,
           default:null
       },
       pre_tw:{
            type:cc.Prefab,
            default:null
        },
       node_dian:{
           type:[cc.Node],
           default:[]
       },
       node_nextLevel:{
            type:cc.Node,
            default:null
       },
       node_btnLevel:{
            type:cc.Node,
            default:null
        },
        node_levelCurrent:{//当前关卡  做动画的
            type:cc.Node,
            default:null
        },
        audio_success:{
            type:cc.AudioClip,
            default:null
        },
    },

    onLoad () {
        cc.log('QQ：2504549300')
        cc.log('微信：cocoscreator_666')
        window.game = this
        this.isSuccess = false //是否过关
        this.cantouch = true; //是否过关
        this.speed = 700 //hero的移动速度
        this.level_num = 1 //当前的关卡
        this.level_num_max = 9 //最大关卡
        this.setTouch()
        cc.director.getPhysicsManager().enabled = true;
        this.setLevel()
        this.reSetBlocks()
        //this.hero.getComponent(cc.RigidBody).linearVelocity = cc.v2(200,0)      
        this.cleanDian()
        this.time_tw = 0
        this.can_tw = false
        this.isTouchStart = false
        this.node_nextLevel.active = false
        this.node_btnLevel.active = false
        this.node_levelCurrent.active = false
        this.i_audio_w = -1 //白块音效数组角标
        this.i_audio_xpj = -1 //xpj音效数组角标

        var b = cc.director.getWinSizeInPixels()
        var bx = b.width
        var by = b.height

        this.f_scale = b.width / 720.0
        cc.log('f_scale:'+this.f_scale)
        this.node_level.scale = this.f_scale
        this.node.getChildByName('parent_tx').scale = this.f_scale
    },

    //设置瞄准的9个小球
    setDian:function(pos){
        var pos_cha = cc.v2(pos.x-this.pos_start.x,pos.y-this.pos_start.y)
        var pos_cha_1 = cc.v2(pos_cha.x/this.node_dian.length,pos_cha.y/this.node_dian.length)
        for (let i = 0; i < this.node_dian.length; i++) {
            this.node_dian[i].active = true
            var pos_dian = cc.v2(this.pos_start.x+pos_cha_1.x * i,this.pos_start.y+pos_cha_1.y * i)
            this.node_dian[i].setPosition(pos_dian)
        }
    },

    //隐藏瞄准的9个小球
    cleanDian:function(){
        for (let i = 0; i < this.node_dian.length; i++) {
            this.node_dian[i].active = false
        }
    },

    setTouch:function(){
        // 使用事件名来注册
        this.node.on('touchstart', function (event) {
            cc.log('touchstart')
            if(!this.cantouch)return;
            if(this.isSuccess) return
            this.i_audio_w = -1
            this.i_audio_xpj = -1 
            this.isTouchStart = true
            this.reSetBlocks()
            this.hero.active = true
            this.hero.getComponent(cc.RigidBody).linearVelocity = cc.v2(0,0)
            this.pos_start = event.getLocation()
            this.pos_start = this.hero.parent.convertToNodeSpaceAR(this.pos_start)
            this.hero.setPosition(this.pos_start)
            this.can_tw = false

        }, this)

        this.node.on('touchmove', function (event) {
            cc.log('touchmove')
            if(!this.cantouch)return;
            if(this.isSuccess) return
            if(!this.isTouchStart) return
            var pos_move = event.getLocation()
            var pos_move = this.hero.parent.convertToNodeSpaceAR(pos_move)
            this.setDian(pos_move)
        }, this)

        var touchendCall = function (event) {
            if(!this.cantouch)return;
            if(this.isSuccess) return;
            if(!this.isTouchStart) return;
            this.cantouch = false;
            this.isTouchStart = false
            var pos_end = event.getLocation()
            pos_end = this.hero.parent.convertToNodeSpaceAR(pos_end)

            var pos_cha = cc.v2(pos_end.x-this.pos_start.x,pos_end.y-this.pos_start.y)

            var vv = cc.v2(0,0)
            var zz = Math.sqrt(pos_cha.x*pos_cha.x + pos_cha.y*pos_cha.y)
            if (zz < 20) {
                this.cantouch = true;
                this.hero.active = false
                this.cleanDian()

                if (this.node_btnLevel.active) {
                    this.node_btnLevel.active = false
                }else{
                    this.node_btnLevel.active = true
                }
                
                return
            }
            this.node_btnLevel.active = false
            pos_cha.x = pos_cha.x / zz * this.speed
            pos_cha.y = pos_cha.y / zz * this.speed

            this.hero.getComponent(cc.RigidBody).linearVelocity = pos_cha
            this.can_tw = true
            let count = 0;
            let timer = setInterval(()=>{
                if(count++>10){
                    clearInterval(timer);
                    return;
                }
                let heroNode = cc.instantiate(this.hero);
                heroNode.parent = this.hero.parent;
                heroNode.setPosition(this.pos_start)
                heroNode.zIndex = 999;
                heroNode.removeComponent("hero");
                // heroNode.getComponent(cc.RigidBody).linearVelocity = cc.v2(0,0);
                heroNode.getComponent(cc.RigidBody).linearVelocity = pos_cha;
            },200)
            //cc.log('touchend')
            //cc.log('相差x:'+pos_cha.x+' 相差y:'+pos_cha.y)
        }

        this.node.on('touchend', touchendCall, this)
        this.node.on('touchcancel', touchendCall, this)
    },

    start () {
        //cc.log('start')
    },

    //添加拖尾
    addTw:function(pos){
        var node_tw = cc.instantiate(this.pre_tw)//实例化预制体
        node_tw.parent = this.node
        node_tw.setPosition(pos)

        var act_1 = cc.delayTime(0.7)
        var act_2 = cc.fadeOut(0.7)
        var act_3 = cc.spawn(act_1,act_2)
        var act_4 = cc.callFunc(function(){
            node_tw.removeFromParent()
        },this)
        var end = cc.sequence(act_3,act_4)
        node_tw.runAction(end)
    },

    //添加碰撞白块或橡皮筋的特效
    createTx:function(type_tx,pos,w_tx,h_tx,angle_tx){
        var node_tx = cc.instantiate(this.pre_tx)//实例化预制体
        node_tx.parent = this.node.getChildByName('parent_tx')

        var js_tx = node_tx.getComponent('node_tx')
        js_tx.init(type_tx,pos,w_tx,h_tx,angle_tx)
    },

    //显示当前关卡
    setLevel:function(){
       var children = this.node_level.children
       for (let i = 0; i < children.length; i++) {
           children[i].active = false
       }

       this.node_level.getChildByName(this.level_num + '').active = true

       var children_1 = this.node_level.getChildByName(this.level_num + '').children
       for (let i = 0; i < children_1.length; i++) {
            children_1[i].scale = 0.8
       }
    },

    //显示当前关卡所有的块
    reSetBlocks:function(){
        this.cantouch = true;
        var children = this.node_level.getChildByName(this.level_num + '').children
        for (let i = 0; i < children.length; i++) {
            if (children[i].active == false) {
                children[i].active = true
            }
            if (children[i].scale < 1) {
                children[i].opacity = 0
                var act_1 = cc.scaleTo(0.3,1)
                var act_2 = cc.fadeTo(0.3,255)
                var end = cc.spawn(act_1,act_2)
                children[i].runAction(end)
            }
        }
    },

     //判断是否通过
     pdSuccess:function(){
        this.isSuccess = false
        var children = this.node_level.getChildByName(this.level_num + '').children
        for (let i = 0; i < children.length; i++) {
            var block_tag = -1
            if (children[i].getComponent('cc.PhysicsBoxCollider')) {//box
                block_tag = children[i].getComponent('cc.PhysicsBoxCollider').tag
            }else if (children[i].getComponent('cc.PhysicsCircleCollider')) {//Circle
                block_tag = children[i].getComponent('cc.PhysicsCircleCollider').tag
            }else if(children[i].getComponent('cc.PhysicsChainCollider')){//Chain
                block_tag = children[i].getComponent('cc.PhysicsChainCollider').tag
            }
            if (block_tag == 0) {//白块或橡皮筋
                if (children[i].active == true) {
                    return false
                }
            }
        }
        this.isSuccess = true
        return true
    },

    //下一关
    nextLevel:function(){
        this.isSuccess = false
        this.i_audio_w = -1
        this.i_audio_xpj = -1 
        this.level_num++
        if (this.level_num > this.level_num_max) {
            this.level_num = this.level_num_max
        }
        this.setLevel()
        this.reSetBlocks()
    },

    //上一关
    downLevel:function(){
        this.isSuccess = false
        this.i_audio_w = -1
        this.i_audio_xpj = -1 
        this.level_num--
        if (this.level_num < 1) {
            this.level_num = 1
        }
        this.setLevel()
        this.reSetBlocks()
    },

    //点击按钮的回调
    clickBtn:function(sender,str){
        if(str == 'btn_up'){
            cc.log('点击了按钮:下一关')
            this.nextLevel()
        }else if(str == 'btn_down'){
            this.downLevel()
            cc.log('点击了按钮:上一关')
        }

        this.node_levelCurrent.stopAllActions()
        this.node_levelCurrent.getComponent(cc.Label).string = this.level_num
        this.node_levelCurrent.active = true
        this.node_levelCurrent.opacity = 100
        var act_1 = cc.delayTime(0.5)
        var act_2 = cc.fadeOut(0.8)
        var end = cc.sequence(act_1,act_2)
        this.node_levelCurrent.runAction(end)
    },

    //下一关动画
    actNextLevel:function(){
        this.node_nextLevel.active = true
        var node_currentLevel = this.node_nextLevel.getChildByName('current_level')
        var node_nextLevel = this.node_nextLevel.getChildByName('next_level')
        node_currentLevel.getComponent(cc.Label).string = this.level_num
        node_nextLevel.getComponent(cc.Label).string = this.level_num+1

        node_currentLevel.y = 0
        node_currentLevel.scale = 0
        node_currentLevel.opacity = 0
        var act_1 = cc.scaleTo(0.3,1)
        var act_2 = cc.fadeIn(0.3)
        var act_3 = cc.spawn(act_1,act_2)
        var act_04 = cc.delayTime(0.3)
        var act_4 = cc.moveTo(0.2,cc.v2(0,-480))
        var act_5 = cc.fadeOut(0.3)
        var act_6 = cc.spawn(act_4,act_5)
        var end_1 = cc.sequence(act_3,act_04,act_6)
        node_currentLevel.runAction(end_1)

        node_nextLevel.y = 380
        node_nextLevel.scale = 0
        node_nextLevel.opacity = 0

        var act_21 = cc.delayTime(0.3)
        var act_22 = cc.scaleTo(0.2,1)
        var act_23 = cc.fadeIn(0.2)
        var act_24 = cc.spawn(act_22,act_23)
        var act_25 = cc.moveTo(0.3,cc.v2(0,-50))
        var act_26 = cc.moveTo(0.05,cc.v2(0,25))
        var act_27 = cc.moveTo(0.05,cc.v2(0,-25))
        var act_28 = cc.moveTo(0.02,cc.v2(0,0))
        var act_29 = cc.delayTime(0.4)
        var act_30 = cc.fadeOut(0.5)
        var end_2 = cc.sequence(act_21,act_24,act_25,act_26,act_27,act_28,act_29,act_30)
        node_nextLevel.runAction(end_2)

        this.scheduleOnce(function() {
            cc.audioEngine.play(this.audio_success, false, 1)
        }, 1)

        this.scheduleOnce(function() {
            this.node_nextLevel.active = false
            this.nextLevel()
        }, 2)
    },

    update (dt) {//1秒钟执行60次 dt大约等于 1/60
       var pos_hero = this.hero.getPosition()
       if (pos_hero.x < -390 || pos_hero.x > 390 || pos_hero.y < -670 || pos_hero.y > 670) {
            this.hero.active = false
            this.hero.setPosition(cc.v2(0,0))
           if (this.isSuccess) {
               this.actNextLevel()
           }else{
                this.reSetBlocks()
           }
       }
       this.time_tw ++
       if(this.time_tw % 2 == 0){
           if(this.hero.active &&　 this.can_tw ){
                this.addTw(this.hero.getPosition())
           }
       }
       
    },
});
