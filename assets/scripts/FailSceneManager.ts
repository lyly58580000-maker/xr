import { _decorator, Component, director } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 游戏失败界面管理器
 */
@ccclass('FailSceneManager')
export class FailSceneManager extends Component {
    restartGame(): void {
        director.loadScene('GameScene');
    }

    backToMenu(): void {
        director.loadScene('StartScene');
    }
}
