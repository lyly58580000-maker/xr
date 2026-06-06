import { _decorator, Component, Node, Vec3, Material, MeshRenderer } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 斗拱构件逻辑
 * 包含目标位置、吸附判定、放置状态等
 */
@ccclass('Piece')
export class Piece extends Component {
    @property({ type: Node })
    targetNode: Node | null = null;

    @property
    snapThreshold: number = 0.5;

    @property
    scoreValue: number = 10;

    private _isPlaced: boolean = false;
    private _originalPosition: Vec3 = new Vec3();
    private _originalRotation: Vec3 = new Vec3();
    private _highlightMat: Material | null = null;
    private _normalMat: Material | null = null;

    get isPlaced(): boolean {
        return this._isPlaced;
    }

    onLoad() {
        this._originalPosition.set(this.node.position);
        this._originalRotation.set(this.node.eulerAngles);
    }

    /**
     * 尝试放置构件
     * 如果距离目标位置小于阈值，则吸附到目标位置
     */
    tryPlace(): boolean {
        if (this._isPlaced || !this.targetNode) return false;

        const currentPos = this.node.worldPosition;
        const targetPos = this.targetNode.worldPosition;
        const distance = Vec3.distance(currentPos, targetPos);

        if (distance <= this.snapThreshold) {
            // 吸附到目标位置
            this.node.setWorldPosition(targetPos);
            this.node.setWorldRotation(this.targetNode.worldRotation);
            this._isPlaced = true;

            // 禁用物理/碰撞，防止再次拾取
            this.disableInteraction();

            return true;
        }

        return false;
    }

    /**
     * 重置构件到初始位置
     */
    reset(): void {
        this.node.setPosition(this._originalPosition);
        this.node.setRotationFromEuler(this._originalRotation.x, this._originalRotation.y, this._originalRotation.z);
        this._isPlaced = false;
        this.enableInteraction();
    }

    /**
     * 设置高亮材质（可选）
     */
    setHighlight(highlight: boolean): void {
        const meshRenderer = this.node.getComponent(MeshRenderer);
        if (!meshRenderer) return;

        if (highlight && this._highlightMat) {
            meshRenderer.material = this._highlightMat;
        } else if (this._normalMat) {
            meshRenderer.material = this._normalMat;
        }
    }

    private disableInteraction(): void {
        const collider = this.node.getComponent('Collider');
        if (collider) {
            (collider as any).enabled = false;
        }
    }

    private enableInteraction(): void {
        const collider = this.node.getComponent('Collider');
        if (collider) {
            (collider as any).enabled = true;
        }
    }
}
