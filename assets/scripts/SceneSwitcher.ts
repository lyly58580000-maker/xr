import { _decorator, Component, director } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 场景切换工具
 * 挂载在UI按钮上用于切换场景
 */
@ccclass('SceneSwitcher')
export class SceneSwitcher extends Component {
    @property
    targetScene: string = '';

    switchScene(): void {
        if (this.targetScene) {
            director.loadScene(this.targetScene);
        }
    }
}
