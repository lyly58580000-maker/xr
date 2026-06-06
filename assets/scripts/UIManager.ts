import { _decorator, Component, director, Node } from 'cc';
const { ccclass, property } = _decorator;

/**
 * UI管理器
 * 统一管理游戏内UI的显示/隐藏
 */
@ccclass('UIManager')
export class UIManager extends Component {
    @property({ type: Node })
    startMenuPanel: Node | null = null;

    @property({ type: Node })
    gameHUDPanel: Node | null = null;

    @property({ type: Node })
    completePanel: Node | null = null;

    @property({ type: Node })
    failPanel: Node | null = null;

    @property({ type: Node })
    rulesPanel: Node | null = null;

    @property({ type: Node })
    leaderboardPanel: Node | null = null;

    onLoad() {
        this.showStartMenu();
    }

    showStartMenu(): void {
        this.hideAllPanels();
        if (this.startMenuPanel) this.startMenuPanel.active = true;
    }

    showGameHUD(): void {
        this.hideAllPanels();
        if (this.gameHUDPanel) this.gameHUDPanel.active = true;
    }

    showCompletePanel(): void {
        this.hideAllPanels();
        if (this.completePanel) this.completePanel.active = true;
    }

    showFailPanel(): void {
        this.hideAllPanels();
        if (this.failPanel) this.failPanel.active = true;
    }

    toggleRules(): void {
        if (this.rulesPanel) {
            this.rulesPanel.active = !this.rulesPanel.active;
        }
    }

    toggleLeaderboard(): void {
        if (this.leaderboardPanel) {
            this.leaderboardPanel.active = !this.leaderboardPanel.active;
        }
    }

    hideAllPanels(): void {
        if (this.startMenuPanel) this.startMenuPanel.active = false;
        if (this.gameHUDPanel) this.gameHUDPanel.active = false;
        if (this.completePanel) this.completePanel.active = false;
        if (this.failPanel) this.failPanel.active = false;
        if (this.rulesPanel) this.rulesPanel.active = false;
        if (this.leaderboardPanel) this.leaderboardPanel.active = false;
    }
}
