import {
    _decorator,
    Camera,
    Component,
    director,
    EventMouse,
    input,
    Input,
    Node,
    Vec3,
} from 'cc';
import { Piece } from './Piece';

const { ccclass, property } = _decorator;

@ccclass('PiecePicker')
export class PiecePicker extends Component {
    @property({ type: Camera })
    mainCamera: Camera | null = null;

    @property
    dragPlaneDistance = 10;

    @property
    moveSpeed = 1;

    private _pickedNode: Node | null = null;
    private _pickedPiece: Piece | null = null;
    private _isDragging = false;
    private _dragOffset = new Vec3();
    private _screenPos = new Vec3();
    private _dragPlaneY = 0;
    private _lastMousePos = new Vec3();

    onLoad() {
        input.on(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
        input.on(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
        input.on(Input.EventType.MOUSE_UP, this.onMouseUp, this);
    }

    onDestroy() {
        input.off(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
        input.off(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
        input.off(Input.EventType.MOUSE_UP, this.onMouseUp, this);
    }

    private onMouseDown(event: EventMouse) {
        if (event.getButton() !== EventMouse.BUTTON_LEFT || !this.mainCamera) return;

        const piece = this.findPieceNearScreenPoint(event.getLocationX(), event.getLocationY());
        if (!piece || piece.isPlaced) return;

        this._pickedNode = piece.node;
        this._pickedPiece = piece;
        this._isDragging = true;
        this._dragPlaneY = this._pickedNode.worldPosition.y;
        this._lastMousePos.set(event.getLocationX(), event.getLocationY(), 0);

        console.log('Picked piece:', this._pickedNode.name);
    }

    private onMouseMove(event: EventMouse) {
        if (!this._isDragging || !this._pickedNode || !this.mainCamera) return;

        const deltaX = event.getLocationX() - this._lastMousePos.x;
        const deltaY = event.getLocationY() - this._lastMousePos.y;
        this._lastMousePos.set(event.getLocationX(), event.getLocationY(), 0);

        const currentPos = this._pickedNode.worldPosition;
        this._pickedNode.setWorldPosition(
            currentPos.x + deltaX * this.moveSpeed,
            this._dragPlaneY,
            currentPos.z - deltaY * this.moveSpeed
        );
    }

    private onMouseUp(event: EventMouse) {
        if (event.getButton() !== EventMouse.BUTTON_LEFT) return;

        if (this._pickedPiece) {
            const placed = this._pickedPiece.tryPlace();
            if (placed) {
                const gameManager = (window as any).gameManager;
                if (gameManager) {
                    gameManager.onPiecePlaced(this._pickedPiece);
                }
            }
        }

        this._pickedNode = null;
        this._pickedPiece = null;
        this._isDragging = false;
    }

    public getPickedNode(): Node | null {
        return this._pickedNode;
    }

    public isDragging(): boolean {
        return this._isDragging;
    }

    private findPieceNearScreenPoint(screenX: number, screenY: number): Piece | null {
        if (!this.mainCamera) return null;

        const scene = director.getScene();
        if (!scene) return null;

        const pieces = scene.getComponentsInChildren(Piece);
        let bestPiece: Piece | null = null;
        let bestDistance = Number.POSITIVE_INFINITY;
        const pickRadius = 80;

        for (const piece of pieces) {
            if (!piece.node.activeInHierarchy || piece.isPlaced) continue;

            this.mainCamera.worldToScreen(piece.node.worldPosition, this._screenPos);
            const dx = this._screenPos.x - screenX;
            const dy = this._screenPos.y - screenY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < pickRadius && distance < bestDistance) {
                bestDistance = distance;
                bestPiece = piece;
            }
        }

        return bestPiece;
    }
}
