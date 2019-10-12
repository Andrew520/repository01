cc.Class({
    extends: cc.Component,

    properties: {
       //主角跳跃高度
       jumpHeight: 0,
       //主角跳跃持续时间
       jumpDuration: 0,
       //最大移动速度
       maxMoveSpeed: 0,
       //加速度
       accel: 0,
       //跳跃音效资源
       jumpAudio: {
           default: null,
           type: cc.AudioClip
       },
    },

    
    setJumpAction: function() {
        //跳跃上升,在jumpDuration的时间内，移动到当前节点的(0,this.jumpHeight)的位置坐标，
        var jumpUp = cc.moveBy(this.jumpDuration,cc.v2(0,this.jumpHeight)).easing(cc.easeCubicActionOut());
        //下落
        var jumpDown = cc.moveBy(this.jumpDuration,cc.v2(0,-this.jumpHeight)).easing(cc.easeCubicActionIn());
        //添加一个回调函数，用于在动作结束时调用我们定义的其他方法
        var callback = cc.callFunc(this.playJumpSound, this);
        //不断重复，而且每次完成落地动作后调用回调来播放声音
        return cc.repeatForever(cc.sequence(jumpUp, jumpDown,callback));
    },


    playJumpSound: function () {
        //调用声音引擎播放声音
        cc.audioEngine.playEffect(this.jumpAudio, false);
    },


    onKeyDown(event){
        //set a flag when key pressed
        switch(event.keyCode) {
            case cc.macro.KEY.a:
            this.accLeft = true;
            break;
            case cc.macro.KEY.d:
            this.accRight = true;
            break;
        }
    },

    onKeyUp(event){
        //unset a flag when key pressed
        switch(event.keyCode) {
           case cc.macro.KEY.a:
           this.accLeft = false;
           break;
           case cc.macro.KEY.d:
           this.accRight = false;
           break;
       }
    },


     //onLoad 方法会在场景加载后立刻执行，所以我们会把初始化相关的操作和逻辑都放在这里面
     onLoad: function() {
         //初始化跳跃动作
         this.jumpAction = this.setJumpAction();
         this.node.runAction(this.jumpAction);

         //加速度方向开关
         this.accLeft = false;
         this.accRight = false;
         //主角当前水平方向速度
         this.xSpeed = 0;

         //初始化键盘输入监听, 通过systemEvent来监听系统全局事件
         cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
         cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
     },


     onDestroy(){
         //取消键盘输入监听
         cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
         cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyDown, this);
     },


    start () {

    },


    //update 在场景加载后就会每帧调用一次，我们一般把需要经常计算或及时更新的逻辑内容放在这里
    update: function (dt) {
        //根据当前加速度方向每帧更新速度
        if(this.accLeft) {
            this.xSpeed -= this.accel * dt;
        } else if (this.accRight) {
            this.xSpeed += this.accel * dt;
        }

        //限制主角的速度不能超过最大值
        if(Math.abs(this.xSpeed) > this.maxMoveSpeed ) {
            //if speed reach limit, use max speed with current direction
            this.xSpeed = this.maxMoveSpeed * this.xSpeed / Math.abs(this.xSpeed);
        }

        //根据当前速度更新主角的位置
        this.node.x += this.xSpeed * dt;
        
        //限制怪兽的移动范围
        if (this.node.x > this.node.parent.width/2) {
            this.node.x = this.node.parent.width/2;
            this.xSpeed = 0;
        } else if (this.node.x < -this.node.parent.width/2) {
            this.node.x = -this.node.parent.width/2;
            this.xSpeed = 0;
        }
    },

});