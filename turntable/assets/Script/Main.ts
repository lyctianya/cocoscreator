import Item from "./Item";

const { ccclass, property, executeInEditMode } = cc._decorator;
@ccclass
@executeInEditMode
export default class Helloworld extends cc.Component {
    @property({ type: cc.Prefab, displayName: "单元格" })
    prefab_item: cc.Prefab = null;

    @property({ type: cc.Node, displayName: "转盘" })
    table: cc.Node = null;

    @property({
        displayName: "行数",
        min: 1,
        step: 1,
        visible() {
            return false;
        },
    })
    _rowNum: number = 5;

    @property({ displayName: "行数", min: 1, step: 1 })
    get rowNum(): number {
        return this._rowNum;
    }
    set rowNum(v: number) {
        this._rowNum = v;
        this.initView();
    }

    @property({
        displayName: "列数",
        min: 1,
        step: 1,
        visible() {
            return false;
        },
    })
    _colNum: number = 5;

    @property({ displayName: "列数", min: 1, step: 1 })
    set colNum(v: number) {
        this._colNum = v;
        this.initView();
    }
    get colNum(): number {
        return this._colNum;
    }

    @property({ type: cc.Label, displayName: "描述" })
    lb_desc: cc.Label = null;

    @property({ type: cc.EditBox, displayName: "输入框" })
    edit_num: cc.EditBox = null;

    private curNum = -1;

    private get maxNum(): number {
        return 2 * this.colNum + (this.rowNum - 2) * 2;
    }

    private useItemList: Array<Item> = [];
    onLoad() {
        this.initView();
    }
    start() {}
    initView() {
        const row = this.rowNum;
        const col = this.colNum;
        //设定描述
        this.lb_desc.string = `请输入1~${this.maxNum}其中一位整数，代表要停止的位置`;
        //设定大转盘
        this.useItemList.length = this.maxNum;
        this.table.removeAllChildren();
        this.table.width = this.colNum * (150 + 10) + 10;
        for (let i = 0; i < row; i++) {
            let rowData = [];
            for (let j = 0; j < col; j++) {
                let cloneItem = cc.instantiate(this.prefab_item);
                this.table.addChild(cloneItem);
                const itemScript = cloneItem.getComponent("Item");
                rowData.push(itemScript);
                let tmpnum = -1;
                if (i == 0) {
                    tmpnum = j + 1;
                } else if (i == row - 1) {
                    tmpnum = 2 * col + row - 2 - j;
                } else if (j == 0) {
                    tmpnum = 2 * col + (row - 2) * 2 + 1 - i;
                } else if (j == col - 1) {
                    tmpnum = col + i;
                }
                itemScript.setLabel(tmpnum == -1 ? "" : tmpnum);
                if (tmpnum != -1) {
                    this.useItemList[tmpnum - 1] = itemScript;
                }
            }
        }
    }

    runTurnTable() {
        const num = parseInt(this.edit_num.string);
        if (isNaN(num) || num < 1 || num > this.maxNum) {
            // 闪一下给个提示，不飘提示文本了
            cc.tween(this.lb_desc.node).blink(0.3, 5).start();
            return;
        }
        //旋转之前恢复 1~n的展示
        this.useItemList.forEach((item, index) =>
            item.setLabel((index + 1).toString())
        );

        if (this.curNum < 1) {
            // 抽奖一直从1开始不好，每次不重置比较好
            //如果以前没转过，
            this.curNum = 1;
        }

        //开始转
        const speedupTime = 1;
        const runTime = Math.random() * 2 + 1;
        const slowdownTime = 1;
        const speed = 20; //每秒20个数字
        const finalNum =
            Math.ceil(
                ((speedupTime + runTime + slowdownTime) * speed) / this.maxNum
            ) *
                this.maxNum +
            num;

        let self = this;
        let preItem: Item = null;
        let obj = {
            _curNum: self.curNum,
            get curNum(): number {
                return this._curNum;
            },
            set curNum(v: number) {
                this._curNum = v;
                if (preItem) {
                    preItem.showHightLight(false);
                }
                preItem =
                    self.useItemList[
                        (Math.floor(this.curNum) - 1) % self.maxNum
                    ];
                preItem.showHightLight(true);
            },
        };
        this.curNum = num;

        cc.tween(obj)
            .to(
                speedupTime,
                { curNum: speedupTime * speed },
                { easing: "sineIn" }
            ) //加速阶段
            .to(runTime, { curNum: (speedupTime + runTime) * speed }) //平稳阶段
            .to(
                slowdownTime,
                {
                    curNum: finalNum,
                },
                { easing: "sineOut" }
            )
            .call(() => {
                this.useItemList[this.curNum - 1].showSelect();
            })
            .delay(2)
            .call(() => {
                this.useItemList.forEach((item) => item.setLabel("" + 100));
            })
            .start();
    }
}
