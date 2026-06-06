import { _decorator, Component, director, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 开始界面管理器
 * 显示最高分、最快用时榜，处理开始游戏逻辑
 */
@ccclass('StartMenuManager')
export class StartMenuManager extends Component {
    @property({ type: Node })
    highScoreLabel: Node | null = null;

    @property({ type: Node })
    bestTimeLabel: Node | null = null;

    @property({ type: Node })
    rulesPanel: Node | null = null;

    onLoad() {
        this.loadLeaderboard();
    }

    /**
     * 加载排行榜数据
     */
    loadLeaderboard(): void {
        const key = 'dougong_scores';
        const scores: { time: number; score: number; date: string }[] = JSON.parse(localStorage.getItem(key) || '[]');

        if (scores.length > 0) {
            const highest = scores[0];
            if (this.highScoreLabel) {
                const label = this.highScoreLabel.getComponent(Label);
                if (label) label.string = `最高分: ${highest.score}`;
            }

            // 最快用时（完成游戏的记录）
            const completedGames = scores.filter(s => s.time > 0);
            if (completedGames.length > 0) {
                const fastest = completedGames.reduce((a, b) => a.time < b.time ? a : b);
                if (this.bestTimeLabel) {
                    const label = this.bestTimeLabel.getComponent(Label);
                    if (label) {
                        const minutes = Math.floor(fastest.time / 60);
                        const seconds = Math.floor(fastest.time % 60);
                        label.string = `最快用时: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                    }
                }
            }
        }
    }

    /**
     * 显示/隐藏规则面板
     */
    toggleRules(): void {
        if (this.rulesPanel) {
            this.rulesPanel.active = !this.rulesPanel.active;
        }
    }

    /**
     * 开始游戏
     */
    startGame(): void {
        director.loadScene('GameScene');
    }

    /**
     * 退出游戏（在Web/Simulator中无效，在Pico中可调用平台API）
     */
    quitGame(): void {
        // 在Pico平台可调用: director.end();
        // 在Web环境中关闭窗口
        if (typeof window !== 'undefined') {
            window.close();
        }
    }
}
