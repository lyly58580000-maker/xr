import { _decorator, Component, director, Label, Node } from 'cc';
import { Piece } from './Piece';
const { ccclass, property } = _decorator;

/**
 * 游戏管理器
 * 控制游戏状态、计时、计分、胜负判定
 * 兼容Web(localStorage)和原生环境(sys.localStorage)
 */
@ccclass('GameManager')
export class GameManager extends Component {
    @property({ type: [Node] })
    pieces: Node[] = [];

    @property({ type: Node })
    timerLabel: Node | null = null;

    @property({ type: Node })
    scoreLabel: Node | null = null;

    @property
    totalScore: number = 0;

    private _isPlaying: boolean = false;
    private _startTime: number = 0;
    private _elapsedTime: number = 0;
    private _score: number = 0;
    private _placedCount: number = 0;

    get score(): number {
        return this._score;
    }

    get elapsedTime(): number {
        return this._elapsedTime;
    }

    get isPlaying(): boolean {
        return this._isPlaying;
    }

    onLoad() {
        // 单例模式
        if ((window as any).gameManager && (window as any).gameManager !== this) {
            this.node.destroy();
            return;
        }
        (window as any).gameManager = this;
    }

    update(deltaTime: number) {
        if (!this._isPlaying) return;

        this._elapsedTime = (Date.now() - this._startTime) / 1000;
        this.updateTimerUI();
    }

    /**
     * 开始游戏
     */
    startGame(): void {
        this._isPlaying = true;
        this._startTime = Date.now();
        this._elapsedTime = 0;
        this._score = 0;
        this._placedCount = 0;

        // 重置所有构件
        for (const pieceNode of this.pieces) {
            const piece = pieceNode.getComponent(Piece);
            if (piece) {
                piece.reset();
            }
        }

        this.updateScoreUI();
        this.updateTimerUI();
    }

    /**
     * 构件放置成功回调
     */
    onPiecePlaced(piece: Piece): void {
        if (!this._isPlaying) return;

        this._score += piece.scoreValue;
        this._placedCount++;
        this.updateScoreUI();

        // 检查是否全部完成
        if (this._placedCount >= this.pieces.length) {
            this.gameComplete();
        }
    }

    /**
     * 游戏完成
     */
    gameComplete(): void {
        this._isPlaying = false;
        this._elapsedTime = (Date.now() - this._startTime) / 1000;

        // 保存成绩
        this.saveScore();

        // 切换到完成界面
        director.loadScene('CompleteScene');
    }

    /**
     * 游戏失败（分数扣完等）
     */
    gameOver(): void {
        this._isPlaying = false;
        director.loadScene('FailScene');
    }

    /**
     * 保存成绩到本地（兼容Web和原生环境）
     */
    private saveScore(): void {
        const key = 'dougong_scores';
        const scores = this.getStorageItem(key, []);
        scores.push({
            time: this._elapsedTime,
            score: this._score,
            date: new Date().toLocaleString()
        });
        // 按分数排序，保留前10
        scores.sort((a: any, b: any) => b.score - a.score);
        if (scores.length > 10) scores.length = 10;
        this.setStorageItem(key, scores);
    }

    /**
     * 兼容的localStorage读取
     */
    private getStorageItem(key: string, defaultValue: any): any {
        try {
            if (typeof localStorage !== 'undefined') {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            }
        } catch (e) {
            console.warn('localStorage读取失败:', e);
        }
        return defaultValue;
    }

    /**
     * 兼容的localStorage写入
     */
    private setStorageItem(key: string, value: any): void {
        try {
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem(key, JSON.stringify(value));
            }
        } catch (e) {
            console.warn('localStorage写入失败:', e);
        }
    }

    private updateTimerUI(): void {
        if (!this.timerLabel) return;
        const label = this.timerLabel.getComponent(Label);
        if (!label) return;

        const minutes = Math.floor(this._elapsedTime / 60);
        const seconds = Math.floor(this._elapsedTime % 60);
        label.string = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    private updateScoreUI(): void {
        if (!this.scoreLabel) return;
        const label = this.scoreLabel.getComponent(Label);
        if (!label) return;
        label.string = `${this._score}`;
    }
}
