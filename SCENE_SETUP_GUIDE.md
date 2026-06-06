# XR斗拱搭建游戏 - 场景搭建指南（小白版）

---

## 🎮 先搞懂几个基本概念

| 名词 | 大白话解释 |
|------|-----------|
| **节点** | 游戏里的每个东西都是一个节点（比如按钮、3D模型、相机） |
| **组件** | 给节点装的"功能插件"（比如让节点能显示、能被点击） |
| **脚本** | 特殊的组件，能让节点"动起来"（比如计时、计分） |
| **预制体** | 把做好的节点保存成模板，以后可以重复用 |
| **挂载** | 把组件/脚本装到节点上（就像给玩具装电池） |

---

## 一、创建第一个场景：开始界面（StartScene）

### 步骤1：新建场景
1. 点击顶部菜单 **文件 → 新建场景**；
2. 保存场景到 `assets/scenes/StartScene.scene`。

### 步骤2：创建UI结构
按下面的结构，在层级管理器里右键创建节点：
```
Canvas（自带的）
├── Camera（自带的）
├── DirectionalLight（自带的）
├── StartMenuPanel（空节点，右键Canvas→创建空节点）
│   ├── TitleLabel（Label，文字写"XR斗拱搭建"）
│   ├── CompleteDougong（空节点，放完整斗拱模型）
│   ├── Button-StartGame（Button，文字"开始游戏"）
│   ├── Button-Rules（Button，文字"游戏规则"）
│   ├── Button-Leaderboard（Button，文字"排行榜"）
│   ├── Button-Quit（Button，文字"退出"）
│   ├── HighScoreLabel（Label，显示最高分）
│   ├── BestTimeLabel（Label，显示最快用时）
│   └── RulesPanel（空节点，默认隐藏）
│       ├── RulesText（Label，写游戏规则）
│       └── Button-Close（Button，文字"关闭"）
└── EventSystem（自带的）
```

### 步骤3：挂载脚本
1. 选中 `Canvas` 节点；
2. 点击右边属性面板最下面的 **添加组件**；
3. 搜索 `StartMenuManager`，点击添加；
4. 在 `StartMenuManager` 组件里：
   - 把层级里的 `HighScoreLabel` 拖到 `highScoreLabel` 框里；
   - 把层级里的 `BestTimeLabel` 拖到 `bestTimeLabel` 框里；
   - 把层级里的 `RulesPanel` 拖到 `rulesPanel` 框里。

### 步骤4：设置按钮点击事件
1. 选中 `Button-StartGame`；
2. 在右边属性面板找到 **Click Events**，点击 `+` 号；
3. 把层级里的 `Canvas` 拖到 `Target` 框里；
4. 点击 `Component` 下拉菜单，选 `StartMenuManager`；
5. 点击 `Handler` 下拉菜单，选 `startGame`。

其他按钮按同样方法设置：
- `Button-Rules` → `toggleRules`
- `Button-Quit` → `quitGame`

---

## 二、创建第二个场景：游戏界面（GameScene）

### 步骤1：新建场景
1. 点击顶部菜单 **文件 → 新建场景**；
2. 保存场景到 `assets/scenes/GameScene.scene`。

### 步骤2：创建核心节点结构
```
Canvas
├── Camera（主相机，Position设为(0,5,10)）
├── DirectionalLight
├── GameManager（空节点）
├── PiecePicker（空节点）
├── GameInitializer（空节点）
├── TargetDougong（空节点）
│   ├── CompleteModel（空节点，放wanzheng.fbx，隐藏）
│   └── TargetPositions（空节点）
│       ├── Target_0（Cube，底座位置）
│       ├── Target_1（Cube，栌斗位置）
│       ├── ...（共25个）
│       └── Target_24
├── PiecesParent（空节点，放所有构件）
├── SpawnPositions（空节点）
│   ├── Spawn_0（空节点，底座初始位置）
│   ├── ...（共25个）
│   └── Spawn_24
└── HUDPanel（空节点）
    ├── TimerLabel（Label，右上角，文字"00:00"）
    ├── ScoreLabel（Label，左上角，文字"0"）
    └── ProgressLabel（Label，显示进度）
```

### 步骤3：挂载脚本并连线
| 节点 | 挂载脚本 | 连线设置 |
|------|---------|---------|
| Camera | CameraController | cameraNode 拖入 Camera |
| GameManager | GameManager | timerLabel 拖入 HUD/TimerLabel；scoreLabel 拖入 HUD/ScoreLabel |
| PiecePicker | PiecePicker | mainCamera 拖入 Camera |
| GameInitializer | GameInitializer | gameManager 拖入 GameManager；piecesParent 拖入 PiecesParent |

### 步骤4：设置目标位置
1. 选中 `Target_0`，移动到斗拱底座的位置；
2. 选中 `Target_1`，移动到栌斗的位置；
3. 依次调整所有 Target 的位置。

---

## 三、创建第三个场景：完成界面（CompleteScene）

### 步骤1：新建场景
1. 点击顶部菜单 **文件 → 新建场景**；
2. 保存场景到 `assets/scenes/CompleteScene.scene`。

### 步骤2：创建UI结构
```
Canvas
├── Camera
├── DirectionalLight
├── CompletePanel（空节点）
│   ├── TitleLabel（Label，文字"恭喜完成！"）
│   ├── FinalTimeLabel（Label，文字"用时：00:00"）
│   ├── FinalScoreLabel（Label，文字"得分：250"）
│   ├── Button-Restart（Button，文字"重新开始"）
│   └── Button-BackToMenu（Button，文字"返回主菜单"）
└── EventSystem
```

### 步骤3：挂载脚本
1. 选中 `CompletePanel`；
2. 添加 `CompleteSceneManager` 脚本；
3. 连线：finalTimeLabel 拖入 FinalTimeLabel，finalScoreLabel 拖入 FinalScoreLabel。

---

## 四、创建第四个场景：失败界面（FailScene）

### 步骤1：新建场景
1. 点击顶部菜单 **文件 → 新建场景**；
2. 保存场景到 `assets/scenes/FailScene.scene`。

### 步骤2：创建UI结构
```
Canvas
├── Camera
├── DirectionalLight
├── FailPanel（空节点）
│   ├── TitleLabel（Label，文字"任务失败"）
│   ├── Button-Restart（Button，文字"重新开始"）
│   └── Button-BackToMenu（Button，文字"返回主菜单"）
└── EventSystem
```

### 步骤3：挂载脚本
1. 选中 `FailPanel`；
2. 添加 `FailSceneManager` 脚本。

---

## 五、创建构件预制体

### 步骤1：创建预制体节点
1. 在场景中创建一个空节点，命名为 `PiecePrefab`；
2. 添加一个子节点，放一个Cube或斗拱部件模型；
3. 给子节点添加 **BoxCollider** 组件（用于射线检测）；
4. 给根节点添加 `Piece.ts` 和 `PiecePrefab.ts` 脚本；
5. 在 `PiecePrefab` 脚本里设置：
   - pieceName：构件名称（如"底座"）；
   - pieceIndex：对应索引（0-24）；
   - isBase：是否为底座（底座设为true）。

### 步骤2：保存为预制体
1. 把节点拖到 `assets/prefabs` 文件夹里；
2. 重复以上步骤，创建25个构件预制体。

---

## 六、设置GameInitializer

1. 选中 `GameInitializer` 节点；
2. 在右边属性面板找到 `GameInitializer` 组件；
3. 点击 `piecePrefabs` 数组旁边的 `+` 号，添加25个元素；
4. 把25个构件预制体依次拖进去；
5. 同样设置 `spawnPositions` 和 `targetPositions` 数组。

---

## 七、测试游戏

1. 点击顶部菜单 **文件 → Build Settings**；
2. 把4个场景都添加到 Build Settings 里；
3. 在顶部工具栏：
   - 预览平台选择 **Simulator**；
   - 点击 **预览** 按钮；
4. 测试操作：
   - WASD 移动视角；
   - 鼠标右键旋转视角；
   - 鼠标左键点击构件拾取；
   - 拖拽构件到目标位置；
   - 按 Tab 切换移动轴。

---

## 八、常见问题解答

### Q1：构件点不到？
- 检查构件有没有添加 **Collider** 组件；
- 检查 `PiecePicker.mainCamera` 是否拖入了 Camera。

### Q2：脚本挂载不上？
- 确保脚本文件在 `assets/scripts` 文件夹里；
- 检查脚本有没有语法错误。

### Q3：场景切换不了？
- 确保场景已添加到 Build Settings；
- 检查脚本里的场景名称是否正确。

---

有任何一步不懂，随时问我！ 😊