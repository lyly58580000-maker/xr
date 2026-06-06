import { _decorator, Component } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 斗拱构件数据定义
 * 定义25个部件（1个底座 + 24个构件）的元数据
 */
@ccclass('DougongPieceData')
export class DougongPieceData extends Component {
    /**
     * 斗拱构件定义列表
     * index: 部件索引
     * name: 部件名称
     * description: 描述
     */
    static readonly PIECES = [
        { index: 0, name: '底座', description: '斗拱底座' },
        { index: 1, name: '栌斗', description: '最下层大斗' },
        { index: 2, name: '泥道拱', description: '纵向拱' },
        { index: 3, name: '华拱', description: '出跳拱' },
        { index: 4, name: '散斗', description: '小斗' },
        { index: 5, name: '交互斗', description: '交互位置小斗' },
        { index: 6, name: '齐心斗', description: '中心小斗' },
        { index: 7, name: '令拱', description: '最外跳拱' },
        { index: 8, name: '耍头', description: '最上层水平构件' },
        { index: 9, name: '衬方头', description: '衬垫构件' },
        { index: 10, name: '慢拱', description: '长拱' },
        { index: 11, name: '瓜子拱', description: '短拱' },
        { index: 12, name: '万拱', description: '万字纹拱' },
        { index: 13, name: '厢拱', description: '厢房用拱' },
        { index: 14, name: '正心瓜拱', description: '正心位置瓜拱' },
        { index: 15, name: '正心万拱', description: '正心位置万拱' },
        { index: 16, name: '外拽瓜拱', description: '外拽架瓜拱' },
        { index: 17, name: '外拽万拱', description: '外拽架万拱' },
        { index: 18, name: '里拽瓜拱', description: '里拽架瓜拱' },
        { index: 19, name: '里拽万拱', description: '里拽架万拱' },
        { index: 20, name: '蚂蚱头', description: '装饰构件' },
        { index: 21, name: '撑头木', description: '支撑构件' },
        { index: 22, name: '桁椀', description: '桁架构件' },
        { index: 23, name: '斗耳', description: '斗的耳部' },
        { index: 24, name: '斗腰', description: '斗的腰部' },
    ];

    static getPieceCount(): number {
        return this.PIECES.length;
    }

    static getPieceName(index: number): string {
        if (index >= 0 && index < this.PIECES.length) {
            return this.PIECES[index].name;
        }
        return '未知构件';
    }

    static getPieceDescription(index: number): string {
        if (index >= 0 && index < this.PIECES.length) {
            return this.PIECES[index].description;
        }
        return '';
    }
}
