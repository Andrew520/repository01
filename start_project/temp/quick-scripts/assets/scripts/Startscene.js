(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/Startscene.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '2089d6/x2FBd63QhxuyCGwj', 'Startscene', __filename);
// scripts/Startscene.js

"use strict";

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

        scoreview: cc.Node,
        scoreItem: cc.Prefab,

        setview: cc.Sprite,

        //music: cc.AudioSource,
        slider_h: cc.Slider

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        this.scoreview = this.scoreview.getComponent(cc.ScrollView);
    },


    //在Slider组件中回调函数
    onSliderHEvent: function onSliderHEvent(sender) {
        this.volumeSetting(sender.progress);
    },
    start: function start() {},


    volumeSetting: function volumeSetting(volume) {
        cc.audioEngine.setEffectsVolume(volume);
    },

    // update (dt) {},
    updateScoreList: function updateScoreList(scoreArr) {
        cc.log("updateScoreList", scoreArr);
        for (var i = 0, cnt = scoreArr.length; i < cnt; i++) {
            var item = cc.instantiate(this.scoreItem);
            var itemData = scoreArr[i];
            var label = item.getChildByName("label");
            label.getComponent(cc.Label).string = "score:" + itemData.score + "    " + "time:" + itemData.time;

            this.scoreview.content.addChild(item);
        }
    },

    playGame: function playGame() {
        cc.log("playGame");
        cc.director.loadScene('game');
    },

    checkShowScoreView: function checkShowScoreView() {
        var active = this.scoreview.node.active;
        this.scoreview.node.active = !active;

        if (this.scoreview.node.active) {
            try {
                var scoreArr = JSON.parse(cc.sys.localStorage.getItem('scoreArr'));

                scoreArr = scoreArr || [];

                this.updateScoreList(scoreArr);
            } catch (error) {}
        }
    },

    gameSetView: function gameSetView() {
        var active1 = this.setview.node.active;
        this.setview.node.active = !active1;
    },

    clearStorage: function clearStorage() {
        cc.sys.localStorage.removeItem('scoreArr');
        cc.log("clearStorage");
        cc.director.loadScene('start');
    },

    goBack: function goBack() {
        cc.log("goBack");
        cc.director.loadScene('start');
    }

});

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=Startscene.js.map
        