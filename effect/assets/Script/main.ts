import { JsonInfo } from '../interface/interface';
import cocosTools from '../tools/cocosTools';

const { ccclass, property } = cc._decorator;

@ccclass
export default class Helloworld extends cc.Component {
    @property(cc.Label)
    title: cc.Label = null;

    @property(cc.ScrollView)
    scView: cc.ScrollView = null;

    @property(cc.Node)
    displayNode: cc.Node = null;

    @property(cc.Node)
    backNode: cc.Node = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Node)
    template: cc.Node = null;

    async onLoad() {
        this.reset();
    }

    cloneItem(info: JsonInfo): cc.Node {
        let item = cc.instantiate(this.template);
        item.getChildByName('name').getComponent(cc.Label).string = info.name;
        item.on(cc.Node.EventType.MOUSE_DOWN, () => {
            this.jumpToTemplate(info);
        });
        item.on(cc.Node.EventType.MOUSE_ENTER, () => {
            item.color = new cc.Color(80, 196, 194, 255);
        });
        item.on(cc.Node.EventType.MOUSE_LEAVE, () => {
            item.color = new cc.Color(64, 147, 145, 255);
        });
        return item;
    }

    async jumpToTemplate(info: JsonInfo) {
        const prefab = <cc.Prefab>await cocosTools.getPrefab(info.prefab);
        if (prefab) {
            this.displayNode.removeAllChildren();
            this.displayNode.addChild(cc.instantiate(prefab));
            this.title.string = info.name;
            this.scView.node.active = false;
            this.backNode.active = true;
        } else {
            this.displayNode.removeAllChildren();
            this.title.string = '请选择Demo';
            this.scView.node.active = true;
        }
    }

    async reset() {
        this.content.removeAllChildren(true);
        const config: Array<JsonInfo> = <Array<JsonInfo>>await cocosTools.getJson('config/config');
        if (config) {
            for (let info of config) {
                this.content.addChild(this.cloneItem(info));
            }
        }
    }

    goback() {
        this.title.string = '请选择Demo';
        this.scView.node.active = true;
        this.displayNode.removeAllChildren();
        this.backNode.active = false;
    }

    start() {}
}
