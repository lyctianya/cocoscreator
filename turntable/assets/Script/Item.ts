// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class Item extends cc.Component {
    @property(cc.Label)
    lb: cc.Label = null;
    setLabel(lb: string) {
        this.lb.string = lb;
    }

    showHightLight(show: boolean) {
        this.node.color = show
            ? new cc.Color(255, 0, 0)
            : new cc.Color(255, 255, 255);
        this.lb.node.color = show
            ? new cc.Color(255, 255, 255)
            : new cc.Color(87, 87, 87);
    }

    showSelect() {
        this.node.color = new cc.Color(0, 255, 0);
        this.lb.node.color = new cc.Color(255, 255, 255);
    }
}
