import { _decorator, Component, instantiate, Node, Prefab, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 目标斗拱构建器
 * 负责在场景中构建完整的目标斗拱（作为放置参考）
 * 并为每个部件创建对应的目标位置节点
 */
@ccclass('TargetDougongBuilder')
export class TargetDougongBuilder extends Component {
    @property({ type: Node })
    dougongModel: Node | null = null;

    @property({ type: [Node] })
    targetPositions: Node[] = [];

    @property
    showTarget: boolean = true;

    onLoad() {
        this.buildTargetDougong();
    }

    /**
     * 构建目标斗拱
     * 如果提供了完整模型，则显示它作为参考
     * 否则使用targetPositions节点作为目标位置
     */
    buildTargetDougong(): void {
        if (this.dougongModel) {
            // 设置完整模型的可见性
            this.dougongModel.active = this.showTarget;
        }
    }

    /**
     * 获取指定索引的目标位置
     */
    getTargetPosition(index: number): Node | null {
        if (index >= 0 && index < this.targetPositions.length) {
            return this.targetPositions[index];
        }
        return null;
    }

    /**
     * 切换目标斗拱的显示/隐藏
     */
    toggleTargetVisibility(): void {
        this.showTarget = !this.showTarget;
        if (this.dougongModel) {
            this.dougongModel.active = this.showTarget;
        }
    }

    /**
     * 获取所有目标位置
     */
    getAllTargetPositions(): Node[] {
        return this.targetPositions;
    }
}
