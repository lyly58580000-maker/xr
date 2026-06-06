import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 游戏规则面板
 */
@ccclass('RulesPanel')
export class RulesPanel extends Component {
    @property({ type: Label })
    rulesText: Label | null = null;

    onLoad() {
        this.showRules();
    }

    showRules(): void {
        if (this.rulesText) {
            this.rulesText.string = `
【游戏规则】

1. 游戏开始后，计时器开始计时
2. 将散落在周围的斗拱构件拖拽到正确位置
3. 每正确放置1个构件得10分
4. 按Tab键可切换移动轴（自由/X/Y/Z）
5. 搭建完成所有构件即可通关

【操作说明】
- WASD: 移动视角
- 鼠标右键: 旋转视角
- Q/E: 上升/下降
- 鼠标左键: 拾取/拖拽构件
- Tab: 切换移动轴模式
            `.trim();
        }
    }
}
