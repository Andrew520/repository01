cc.Class({
    extends: cc.Component,

    //一个节点具有的属性都需要写在 properties 代码块中，这些属性将规定主角的移动方式，
    //在代码中我们不需要关心这些数值是多少，因为我们之后会直接在属性检查器中设置这些数值
    properties: {
        // 这个属性引用了星星预制资源
        starPrefab: {                                                       
            default: null,
            type: cc.Prefab
        },
        // 星星产生后消失时间的随机范围
        maxStarDuration: 0,
        minStarDuration: 0,
        // 地面节点，用于确定星星生成的高度
        ground: {
            default: null,
            type: cc.Node
        },
        // player 节点，用于获取主角弹跳的高度，和控制主角行动开关
        player: {
            default: null,
            type: cc.Node
        },
        //score lable的引用
        scoreDisplay: {
            default: null,
            type: cc.Label
        },
        //得分音效资源
        scoreAudio: {
            default: null,
            type: cc.AudioClip
        },
    },

    onLoad: function () {
        // 获取地平面的 y 轴坐标
        this.groundY = this.ground.y + this.ground.height/2;
        //初始化计时器
        this.time = 0;
        this.starDuration = 0;
        // 生成一个新的星星
        this.spawnNewStar();
        //初始化计分
        this.score = 0;
        this.isGameOver = false;
    },

    spawnNewStar: function() {
        // 使用给定的模板在场景中生成一个新节点
        var newStar = cc.instantiate(this.starPrefab);
        // 将新增的节点添加到 Canvas 节点下面
        this.node.addChild(newStar);
        // 为星星设置一个随机位置
        newStar.setPosition(this.getNewStarPosition());
        // 在星星组件上暂存 Game 对象的引用
        newStar.getComponent('Star').game = this;
        // 重置计时器，根据消失时间范围随机取一个值
        this.starDuration = this.minStarDuration + Math.random() * (this.maxStarDuration - this.minStarDuration);
        this.timer = 0;
    },

    getNewStarPosition: function () {
        var randX = 0;
        // 根据地平面位置和主角跳跃高度，随机得到一个星星的 y 坐标
        var randY = this.groundY + Math.random() * this.player.getComponent('Player').jumpHeight + 50;
        // 根据屏幕宽度，随机得到一个星星 x 坐标
        var maxX = this.node.width/2;
        randX = (Math.random() - 0.5) * 2 * maxX;
        // 返回星星坐标
        return cc.v2(randX, randY);
    },

    start () {

    },

    GoBack:function(){
        cc.log("GoBack");
        cc.director.loadScene('start');
    },

    update: function (dt) {
        // 每帧更新计时器，超过限度还没有生成新的星星就会调用游戏失败逻辑
        if (!this.gameover && this.timer > this.starDuration) {
            this.isGameOver = true
            this.gameOver();
            return;
        }
        this.timer += dt;
    },

    gainScore: function (){
        this.score += 1;
        //更新scoreDisplay Lable 的文字
        this.scoreDisplay.string = 'Score:' + this.score.toString();
        //播放得分音效
        cc.audioEngine.playEffect(this.scoreAudio, false);
    },

    gameOver: function () {
        //停止player节点的跳跃动作
        this.player.stopAllActions(); 
        cc.director.loadScene('start');

        cc.log("scoreArr-gameover",scoreArr)
       
        let scoreJson = cc.sys.localStorage.getItem('scoreArr');
        
        let scoreArr
        try {
            scoreArr = JSON.parse(scoreJson)
        } catch (error) {
            
        }
        if(!scoreArr){
            scoreArr = []
        }

        //显示十一条历史记录
        if(scoreArr.length > 10)
        {
            scoreArr.splice(0,scoreArr.length - 9)
        }

        //截取当前时间
        let  date=new Date();
        let  newdate=date.toLocaleString('chinese', { hour12: false }); 

        scoreArr.push({score:this.score,time:newdate});

        cc.log("scoreArr000",scoreArr)

        cc.sys.localStorage.setItem('scoreArr', JSON.stringify(scoreArr));
    }

});
