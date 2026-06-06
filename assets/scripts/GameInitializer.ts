import { _decorator, Camera, Component, find, instantiate, Layers, Node, Prefab, Vec3 } from 'cc';
import { GameManager } from './GameManager';
import { Piece } from './Piece';

const { ccclass, property } = _decorator;

@ccclass('GameInitializer')
export class GameInitializer extends Component {
    @property({ type: [Prefab] })
    piecePrefabs: Prefab[] = [];

    @property({ type: [Node] })
    spawnPositions: Node[] = [];

    @property({ type: [Node] })
    targetPositions: Node[] = [];

    @property({ type: GameManager })
    gameManager: GameManager | null = null;

    @property({ type: Node })
    piecesParent: Node | null = null;

    private _spawnedPieces: Node[] = [];

    onLoad() {
        console.error('[GI_TEST] GameInitializer onLoad.');
    }

    start() {
        console.error('[GI_TEST] GameInitializer start.');
        this.alignMainCameraForDebug();
        this.initializePieces();
    }

    initializePieces(): void {
        if (this.piecePrefabs.length === 0 || this.spawnPositions.length === 0) {
            console.error(
                `[GI_TEST] GameInitializer missing config. piecePrefabs=${this.piecePrefabs.length}, spawnPositions=${this.spawnPositions.length}.`
            );
            return;
        }

        this.clearSpawnedPieces();

        const parent = this.piecesParent || this.node;
        const pieceNodes: Node[] = [];

        console.error(
            `[GI_TEST] GameInitializer spawning ${this.piecePrefabs.length} pieces with ${this.spawnPositions.length} spawn points.`
        );

        for (let i = 0; i < this.piecePrefabs.length; i++) {
            const prefab = this.piecePrefabs[i];
            const spawnNode = this.spawnPositions[i % this.spawnPositions.length];

            if (!prefab || !spawnNode) {
                console.error(`[GI_TEST] GameInitializer missing prefab or spawn node at index ${i}.`);
                continue;
            }

            const pieceNode = instantiate(prefab);
            pieceNode.name = `Piece_${i}`;
            this.forceVisible(pieceNode);
            parent.addChild(pieceNode);

            const spawnPos = spawnNode.worldPosition;
            console.error(
                `[GI_TEST] using ${spawnNode.name} world=${spawnPos.x},${spawnPos.y},${spawnPos.z} for Piece_${i}.`
            );
            pieceNode.setWorldPosition(spawnPos);
            pieceNode.setWorldRotation(spawnNode.worldRotation);

            const piece = pieceNode.getComponent(Piece);
            if (piece && i < this.targetPositions.length) {
                piece.targetNode = this.targetPositions[i];
            }

            const pos = pieceNode.worldPosition;
            console.error(`[GI_TEST] spawned Piece_${i} actual=${pos.x}, ${pos.y}, ${pos.z}.`);
            this.logNodeTree(pieceNode, `Piece_${i}`);

            this._spawnedPieces.push(pieceNode);
            pieceNodes.push(pieceNode);
        }

        if (this.gameManager) {
            this.gameManager.pieces = pieceNodes;
            this.gameManager.startGame();
        }
    }

    reinitialize(): void {
        this.initializePieces();
    }

    clearSpawnedPieces(): void {
        for (const piece of this._spawnedPieces) {
            if (piece && piece.isValid) {
                piece.destroy();
            }
        }
        this._spawnedPieces = [];
    }

    onDestroy() {
        this.clearSpawnedPieces();
    }

    private forceVisible(node: Node): void {
        node.active = true;
        node.layer = Layers.Enum.DEFAULT;

        for (const child of node.children) {
            this.forceVisible(child);
        }
    }

    private logNodeTree(node: Node, path: string): void {
        const pos = node.worldPosition;
        console.error(
            `[GI_TEST] node ${path} active=${node.activeInHierarchy} layer=${node.layer} world=${pos.x},${pos.y},${pos.z}.`
        );

        for (const child of node.children) {
            this.logNodeTree(child, `${path}/${child.name}`);
        }
    }

    private alignMainCameraForDebug(): void {
        const cameraNode = find('Main Camera');
        const camera = cameraNode?.getComponent(Camera);

        if (!cameraNode || !camera) {
            console.error('[GI_TEST] Main Camera not found for debug alignment.');
            return;
        }

        cameraNode.setWorldPosition(0, 1000, 0);
        cameraNode.setRotationFromEuler(-90, 0, 0);
        camera.projection = Camera.ProjectionType.ORTHO;
        camera.orthoHeight = 360;

        const pos = cameraNode.worldPosition;
        console.error(
            `[GI_TEST] camera aligned world=${pos.x},${pos.y},${pos.z} orthoHeight=${camera.orthoHeight}.`
        );
    }
}
