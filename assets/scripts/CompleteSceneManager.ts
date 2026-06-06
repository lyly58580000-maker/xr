import { _decorator, Component, director, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 游戏完成界面管理器
 * 显示最终用时和得分
 */
@ccclass('CompleteSceneManager')
export class CompleteSceneManager extends Component {
    @property({ type: Node })
    finalTimeLabel: Node | null = null;

    @property({ type: Node })
    finalScoreLabel: Node | null = null;

    onLoad() {
        this.displayResults();
    }

    displayResults(): void {
        const gameManager = (window as any).gameManager;
        if (!gameManager) return;

        if (this.finalTimeLabel) {
            const label = this.finalTimeLabel.getComponent(Label);
            if (label) {
                const time = gameManager.elapsedTime;
                const minutes = Math.floor(time / 60);
                const seconds = Math.floor(time % 60);
                label.string = `用时: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }
        }

        if (this.finalScoreLabel) {
            const label = this.finalScoreLabel.getComponent(Label);
            if (label) {
                label.string = `得分: ${gameManager.score}`;
            }
        }
    }

    restartGame(): void {
        director.loadScene('GameScene');
    }

    backToMenu(): void {
        director.loadScene('StartScene');
    }
}
