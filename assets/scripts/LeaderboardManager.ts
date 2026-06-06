import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 排行榜管理器
 * 显示最高分和最快用时榜
 */
@ccclass('LeaderboardManager')
export class LeaderboardManager extends Component {
    @property({ type: Label })
    highScoreLabel: Label | null = null;

    @property({ type: Label })
    bestTimeLabel: Label | null = null;

    @property({ type: [Label] })
    scoreListLabels: Label[] = [];

    @property({ type: [Label] })
    timeListLabels: Label[] = [];

    onLoad() {
        this.loadLeaderboard();
    }

    loadLeaderboard(): void {
        const key = 'dougong_scores';
        const scores: { time: number; score: number; date: string }[] = this.getStorageItem(key, []);

        // 最高分榜
        if (scores.length > 0) {
            const highest = scores[0];
            if (this.highScoreLabel) {
                this.highScoreLabel.string = `最高分: ${highest.score} (${highest.date})`;
            }

            // 填充分数列表
            for (let i = 0; i < this.scoreListLabels.length; i++) {
                if (i < scores.length) {
                    this.scoreListLabels[i].string = `${i + 1}. ${scores[i].score}分 - ${scores[i].date}`;
                } else {
                    this.scoreListLabels[i].string = `${i + 1}. --`;
                }
            }
        }

        // 最快用时榜（只统计完成游戏的记录）
        const completedGames = scores.filter((s: any) => s.time > 0);
        if (completedGames.length > 0) {
            const fastest = completedGames.reduce((a: any, b: any) => a.time < b.time ? a : b);
            if (this.bestTimeLabel) {
                const minutes = Math.floor(fastest.time / 60);
                const seconds = Math.floor(fastest.time % 60);
                this.bestTimeLabel.string = `最快用时: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} (${fastest.date})`;
            }

            // 填充用时列表
            const sortedByTime = [...completedGames].sort((a: any, b: any) => a.time - b.time);
            for (let i = 0; i < this.timeListLabels.length; i++) {
                if (i < sortedByTime.length) {
                    const minutes = Math.floor(sortedByTime[i].time / 60);
                    const seconds = Math.floor(sortedByTime[i].time % 60);
                    this.timeListLabels[i].string = `${i + 1}. ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} - ${sortedByTime[i].date}`;
                } else {
                    this.timeListLabels[i].string = `${i + 1}. --`;
                }
            }
        }
    }

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
}
