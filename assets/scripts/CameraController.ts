import { _decorator, Component, EventMouse, input, Input, KeyCode, Node, Vec3, Quat, math } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 键鼠模拟XR头显控制器
 * WASD移动，鼠标右键旋转视角，鼠标左键拾取/拖拽
 */
@ccclass('CameraController')
export class CameraController extends Component {
    @property({ type: Node })
    cameraNode: Node | null = null;

    @property
    moveSpeed: number = 5.0;

    @property
    rotateSpeed: number = 0.2;

    private _keys: Set<number> = new Set();
    private _mouseDeltaX: number = 0;
    private _mouseDeltaY: number = 0;
    private _isRightMouseDown: boolean = false;

    onLoad() {
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
        input.on(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
        input.on(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
        input.on(Input.EventType.MOUSE_UP, this.onMouseUp, this);
    }

    onDestroy() {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
        input.off(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
        input.off(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
        input.off(Input.EventType.MOUSE_UP, this.onMouseUp, this);
    }

    update(deltaTime: number) {
        this.handleMovement(deltaTime);
        this.handleRotation(deltaTime);
    }

    private onKeyDown(event: any) {
        this._keys.add(event.keyCode);
    }

    private onKeyUp(event: any) {
        this._keys.delete(event.keyCode);
    }

    private onMouseMove(event: EventMouse) {
        if (this._isRightMouseDown) {
            this._mouseDeltaX += event.getDeltaX();
            this._mouseDeltaY += event.getDeltaY();
        }
    }

    private onMouseDown(event: EventMouse) {
        if (event.getButton() === EventMouse.BUTTON_RIGHT) {
            this._isRightMouseDown = true;
        }
    }

    private onMouseUp(event: EventMouse) {
        if (event.getButton() === EventMouse.BUTTON_RIGHT) {
            this._isRightMouseDown = false;
        }
    }

    private handleMovement(deltaTime: number) {
        if (!this.cameraNode) return;

        const forward = this.cameraNode.forward;
        const right = this.cameraNode.right;
        const moveDir = new Vec3(0, 0, 0);

        if (this._keys.has(KeyCode.KEY_W)) {
            moveDir.add3f(forward.x, 0, forward.z);
        }
        if (this._keys.has(KeyCode.KEY_S)) {
            moveDir.subtract3f(forward.x, 0, forward.z);
        }
        if (this._keys.has(KeyCode.KEY_A)) {
            moveDir.subtract3f(right.x, 0, right.z);
        }
        if (this._keys.has(KeyCode.KEY_D)) {
            moveDir.add3f(right.x, 0, right.z);
        }
        if (this._keys.has(KeyCode.KEY_Q)) {
            moveDir.y -= 1;
        }
        if (this._keys.has(KeyCode.KEY_E)) {
            moveDir.y += 1;
        }

        if (moveDir.lengthSqr() > 0) {
            moveDir.normalize();
            const moveStep = moveDir.multiplyScalar(this.moveSpeed * deltaTime);
            this.cameraNode.setPosition(
                this.cameraNode.position.x + moveStep.x,
                this.cameraNode.position.y + moveStep.y,
                this.cameraNode.position.z + moveStep.z
            );
        }
    }

    private handleRotation(deltaTime: number) {
        if (!this.cameraNode || (this._mouseDeltaX === 0 && this._mouseDeltaY === 0)) return;

        const rotX = this._mouseDeltaY * this.rotateSpeed;
        const rotY = -this._mouseDeltaX * this.rotateSpeed;

        const currentRot = this.cameraNode.rotation;
        const euler = new Vec3();
        currentRot.getEulerAngles(euler);

        euler.x += rotX;
        euler.y += rotY;
        euler.x = math.clamp(euler.x, -89, 89);

        const newRot = Quat.fromEuler(new Quat(), euler.x, euler.y, euler.z);
        this.cameraNode.setRotation(newRot);

        this._mouseDeltaX = 0;
        this._mouseDeltaY = 0;
    }
}
