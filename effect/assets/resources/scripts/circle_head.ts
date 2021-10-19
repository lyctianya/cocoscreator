import cocosTools from '../../tools/cocosTools';

const { ccclass, property, requireComponent } = cc._decorator;

@ccclass
@requireComponent(cc.Sprite)
export default class CircleHead extends cc.Component {
    onLoad() {
        this.refresh();
    }
    async refresh() {
        const data = await cocosTools.getMaterial('material/circle_head/circle_head');
        const material = cc.MaterialVariant.create(data, this.node.getComponent(cc.Sprite));
        material.setProperty('radius', 0.5);
        this.node.getComponent(cc.Sprite).setMaterial(0, material);
    }
}
