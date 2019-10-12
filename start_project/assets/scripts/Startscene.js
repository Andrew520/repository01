cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },

        scoreview:cc.Node,
        scoreItem:cc.Prefab,

        setview:cc.Sprite,

        //music: cc.AudioSource,
        slider_h: cc.Slider

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.scoreview = this.scoreview.getComponent(cc.ScrollView)
    },

    //在Slider组件中回调函数
    onSliderHEvent (sender) {
       this.volumeSetting(sender.progress);
    }, 

    start (){

    },

    volumeSetting: function(volume) {
        cc.audioEngine.setEffectsVolume(volume);
    },

    // update (dt) {},
    updateScoreList: function(scoreArr) {
        cc.log("updateScoreList",scoreArr)
        for(var i = 0,cnt = scoreArr.length;i<cnt;i++)
        {
            let item = cc.instantiate(this.scoreItem)
            let itemData = scoreArr[i]
            let label = item.getChildByName("label")
            label.getComponent(cc.Label).string = "score:"+itemData.score +"    "+"time:"+ itemData.time

            this.scoreview.content.addChild(item)   
        }
    },

    playGame: function() {
        cc.log("playGame");
        cc.director.loadScene('game');
    },

    checkShowScoreView: function() {
        let active = this.scoreview.node.active
        this.scoreview.node.active = !active

        if(this.scoreview.node.active){
            try {
                var scoreArr = JSON.parse(cc.sys.localStorage.getItem('scoreArr'));

                scoreArr = scoreArr || []

                this.updateScoreList(scoreArr)
            } catch (error) {
                
            }
            
        }
            
    },

    gameSetView: function() {
        let active1 = this.setview.node.active
        this.setview.node.active = !active1
    },

    clearStorage: function () {
        cc.sys.localStorage.removeItem('scoreArr');
        cc.log("clearStorage");
        cc.director.loadScene('start');
    },

    goBack: function() {
        cc.log("goBack");
        cc.director.loadScene('start');
    },

    
});

