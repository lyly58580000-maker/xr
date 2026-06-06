import { _decorator, Component, MeshRenderer, Node, Vec3 } from 'cc';
import { UnitConverter } from './UnitConverter';
const { ccclass, property } = _decorator;

/**
 * 构件预制体模板
 * 用于在场景中生成可拖拽的斗拱部件
 * 每个部件对应一个目标位置（完整斗拱上的对应节点）
 */
@ccclass('PiecePrefab')
export class PiecePrefab extends Component {
    @property
    pieceName: string = '';

    @property
    pieceIndex: number = 0;

    @property({ type: Node })
    targetNode: Node | null = null;

    @property
    isBase: boolean = false;

    onLoad() {
        // 应用英尺到米的单位转换
        this.applyUnitConversion();
    }

    /**
     * 应用单位转换（英尺->米）
     */
    applyUnitConversion(): void {
        const currentScale = this.node.scale;
        this.node.setScale(
            currentScale.x * UnitConverter.FEET_TO_METERS,
            currentScale.y * UnitConverter.FEET_TO_METERS,
            currentScale.z * UnitConverter.FEET_TO_METERS
        );

        const currentPos = this.node.position;
        this.node.setPosition(
            currentPos.x * UnitConverter.FEET_TO_METERS,
            currentPos.y * UnitConverter.FEET_TO_METERS,
            currentPos.z * UnitConverter.FEET_TO_METERS
        );
    }

    /**
     * 设置目标节点（完整斗拱上的对应位置）
     */
    setTargetNode(target: Node): void {
        this.targetNode = target;
        const piece = this.node.getComponent('Piece');
        if (piece) {
            (piece as any).targetNode = target;
        }
    }
}
