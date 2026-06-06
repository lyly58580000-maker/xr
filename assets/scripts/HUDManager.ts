import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 游戏HUD管理器
 * 管理游戏中的抬头显示（计时器、分数等）
 */
@ccclass('HUDManager')
export class HUDManager extends Component {
    @property({ type: Label })
    timerLabel: Label | null = null;

    @property({ type: Label })
    scoreLabel: Label | null = null;

    @property({ type: Label })
    progressLabel: Label | null = null;

    @property({ type: Node })
    pausePanel: Node | null = null;

    private _isPaused: boolean = false;

    get isPaused(): boolean {
        return this._isPaused;
    }

    updateTimer(elapsedTime: number): void {
        if (!this.timerLabel) return;
        const minutes = Math.floor(elapsedTime / 60);
        const seconds = Math.floor(elapsedTime % 60);
        this.timerLabel.string = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    updateScore(score: number): void {
        if (!this.scoreLabel) return;
        this.scoreLabel.string = `得分: ${score}`;
    }

    updateProgress(placed: number, total: number): void {
        if (!this.progressLabel) return;
        this.progressLabel.string = `进度: ${placed}/${total}`;
    }

    togglePause(): void {
        this._isPaused = !this._isPaused;
        if (this.pausePanel) {
            this.pausePanel.active = this._isPaused;
        }
    }

    hidePausePanel(): void {
        this._isPaused = false;
        if (this.pausePanel) this.pausePanel.active = false;
    }
}
