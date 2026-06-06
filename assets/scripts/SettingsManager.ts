import { _decorator, Component, Slider, Toggle } from 'cc';
import { DataManager } from './DataManager';
const { ccclass, property } = _decorator;

/**
 * 设置管理器
 * 管理游戏设置：音效、音乐、灵敏度等
 */
@ccclass('SettingsManager')
export class SettingsManager extends Component {
    @property({ type: Toggle })
    soundToggle: Toggle | null = null;

    @property({ type: Toggle })
    musicToggle: Toggle | null = null;

    @property({ type: Slider })
    sensitivitySlider: Slider | null = null;

    private _dataManager: DataManager | null = null;

    onLoad() {
        this._dataManager = (window as any).dataManager;
        this.loadSettings();
    }

    loadSettings(): void {
        if (!this._dataManager) return;

        const settings = this._dataManager.getSettings();

        if (this.soundToggle) {
            this.soundToggle.isChecked = settings.soundEnabled !== false;
        }
        if (this.musicToggle) {
            this.musicToggle.isChecked = settings.musicEnabled !== false;
        }
        if (this.sensitivitySlider) {
            this.sensitivitySlider.progress = settings.sensitivity || 1.0;
        }
    }

    saveSettings(): void {
        if (!this._dataManager) return;

        const settings = {
            soundEnabled: this.soundToggle ? this.soundToggle.isChecked : true,
            musicEnabled: this.musicToggle ? this.musicToggle.isChecked : true,
            sensitivity: this.sensitivitySlider ? this.sensitivitySlider.progress : 1.0
        };

        this._dataManager.saveSettings(settings);
    }

    onSoundToggleChanged(): void {
        this.saveSettings();
    }

    onMusicToggleChanged(): void {
        this.saveSettings();
    }

    onSensitivityChanged(): void {
        this.saveSettings();
    }
}
