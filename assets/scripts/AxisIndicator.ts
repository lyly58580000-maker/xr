import { _decorator, Component, Label, Node } from 'cc';
import { PiecePicker } from './PiecePicker';
const { ccclass, property } = _decorator;

/**
 * 轴模式指示器
 * 显示当前移动轴模式（自由/X/Y/Z）
 */
@ccclass('AxisIndicator')
export class AxisIndicator extends Component {
    @property({ type: PiecePicker })
    piecePicker: PiecePicker | null = null;

    @property({ type: Label })
    axisLabel: Label | null = null;

    update() {
        if (!this.piecePicker || !this.axisLabel) return;

        const mode = this.piecePicker.getAxisMode();
        const axisNames = ['自由移动', 'X轴锁定', 'Y轴锁定', 'Z轴锁定'];
        this.axisLabel.string = `移动模式: ${axisNames[mode]} (按Tab切换)`;
    }
}
