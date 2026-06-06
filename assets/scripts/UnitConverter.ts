import { _decorator, Component, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 单位转换工具
 * 英尺(ft) 转 Cocos单位（米）
 * 1 英尺 = 0.3048 米
 * 在Cocos中，通常1个单位 = 1米
 */
@ccclass('UnitConverter')
export class UnitConverter extends Component {
    static readonly FEET_TO_METERS: number = 0.3048;

    /**
     * 英尺转米
     */
    static feetToMeters(feet: number): number {
        return feet * this.FEET_TO_METERS;
    }

    /**
     * 米转英尺
     */
    static metersToFeet(meters: number): number {
        return meters / this.FEET_TO_METERS;
    }

    /**
     * 将节点的缩放从英尺转换为米
     * 假设模型是按英尺建模的，需要统一缩放到米单位
     */
    static applyFeetToMetersScale(node: any): void {
        if (!node) return;
        const scale = node.scale;
        node.setScale(
            scale.x * this.FEET_TO_METERS,
            scale.y * this.FEET_TO_METERS,
            scale.z * this.FEET_TO_METERS
        );
    }

    /**
     * 转换Vec3（英尺->米）
     */
    static convertVec3(vec: Vec3): Vec3 {
        return new Vec3(
            vec.x * this.FEET_TO_METERS,
            vec.y * this.FEET_TO_METERS,
            vec.z * this.FEET_TO_METERS
        );
    }
}
