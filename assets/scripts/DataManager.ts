import { _decorator, Component } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 数据管理器
 * 统一封装本地存储操作，兼容Web和原生环境
 * 管理：排行榜、用户设置、游戏进度
 */
@ccclass('DataManager')
export class DataManager extends Component {
    static readonly KEYS = {
        SCORES: 'dougong_scores',
        SETTINGS: 'dougong_settings',
        PROGRESS: 'dougong_progress',
        USER: 'dougong_user'
    };

    onLoad() {
        // 单例
        if ((window as any).dataManager && (window as any).dataManager !== this) {
            this.node.destroy();
            return;
        }
        (window as any).dataManager = this;
    }

    // ==================== 通用存储方法 ====================

    getItem(key: string, defaultValue: any = null): any {
        try {
            if (typeof localStorage !== 'undefined') {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            }
        } catch (e) {
            console.warn('存储读取失败:', e);
        }
        return defaultValue;
    }

    setItem(key: string, value: any): void {
        try {
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem(key, JSON.stringify(value));
            }
        } catch (e) {
            console.warn('存储写入失败:', e);
        }
    }

    removeItem(key: string): void {
        try {
            if (typeof localStorage !== 'undefined') {
                localStorage.removeItem(key);
            }
        } catch (e) {
            console.warn('存储删除失败:', e);
        }
    }

    clear(): void {
        try {
            if (typeof localStorage !== 'undefined') {
                localStorage.clear();
            }
        } catch (e) {
            console.warn('存储清空失败:', e);
        }
    }

    // ==================== 排行榜 ====================

    getScores(): { time: number; score: number; date: string }[] {
        return this.getItem(DataManager.KEYS.SCORES, []);
    }

    addScore(time: number, score: number): void {
        const scores = this.getScores();
        scores.push({
            time,
            score,
            date: new Date().toLocaleString()
        });
        // 按分数降序，保留前10
        scores.sort((a: any, b: any) => b.score - a.score);
        if (scores.length > 10) scores.length = 10;
        this.setItem(DataManager.KEYS.SCORES, scores);
    }

    getHighScore(): number {
        const scores = this.getScores();
        return scores.length > 0 ? scores[0].score : 0;
    }

    getBestTime(): number {
        const scores = this.getScores().filter((s: any) => s.time > 0);
        if (scores.length === 0) return -1;
        return scores.reduce((a: any, b: any) => a.time < b.time ? a : b).time;
    }

    clearScores(): void {
        this.removeItem(DataManager.KEYS.SCORES);
    }

    // ==================== 用户设置 ====================

    getSettings(): any {
        return this.getItem(DataManager.KEYS.SETTINGS, {
            soundEnabled: true,
            musicEnabled: true,
            sensitivity: 1.0
        });
    }

    saveSettings(settings: any): void {
        this.setItem(DataManager.KEYS.SETTINGS, settings);
    }

    // ==================== 游戏进度 ====================

    saveProgress(progress: any): void {
        this.setItem(DataManager.KEYS.PROGRESS, progress);
    }

    getProgress(): any {
        return this.getItem(DataManager.KEYS.PROGRESS, null);
    }

    // ==================== 用户信息 ====================

    getUser(): any {
        return this.getItem(DataManager.KEYS.USER, null);
    }

    saveUser(user: any): void {
        this.setItem(DataManager.KEYS.USER, user);
    }

    clearUser(): void {
        this.removeItem(DataManager.KEYS.USER);
    }
}
