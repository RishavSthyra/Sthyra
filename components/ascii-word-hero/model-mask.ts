type ModelMask = {
  image: ImageData;
  maskWidth: number;
  maskHeight: number;
  maskScale: number;
};

type CreateModelMaskOptions = {
  url: string;
  width: number;
  height: number;
  padding?: number;
};

type ThreeModule = typeof import("three");
type GLTFLoaderConstructor = typeof import("three/examples/jsm/loaders/GLTFLoader.js").GLTFLoader;
type Object3D = InstanceType<ThreeModule["Object3D"]>;
type Vector3 = InstanceType<ThreeModule["Vector3"]>;

const moduleCache = new Map<
  "modules",
  Promise<{ THREE: ThreeModule; GLTFLoader: GLTFLoaderConstructor }>
>();
const modelCache = new Map<string, Promise<Object3D>>();
const maskCache = new Map<string, Promise<ModelMask>>();

function getModules() {
  if (!moduleCache.has("modules")) {
    moduleCache.set(
      "modules",
      Promise.all([
        import("three"),
        import("three/examples/jsm/loaders/GLTFLoader.js"),
      ]).then(([THREE, loaderModule]) => ({
        THREE,
        GLTFLoader: loaderModule.GLTFLoader,
      })),
    );
  }

  return moduleCache.get("modules")!;
}

async function getModel(url: string) {
  if (!modelCache.has(url)) {
    const { GLTFLoader } = await getModules();
    const loader = new GLTFLoader();

    modelCache.set(
      url,
      loader.loadAsync(url).then((gltf) => {
        gltf.scene.updateMatrixWorld(true);
        return gltf.scene;
      }),
    );
  }

  return modelCache.get(url)!;
}

function projectVector(
  vector: Vector3,
  scale: number,
  offsetX: number,
  offsetY: number,
  horizontalAxis: 0 | 1 | 2,
  verticalAxis: 0 | 1 | 2,
) {
  const values = [vector.x, vector.y, vector.z] as const;

  return {
    x: values[horizontalAxis] * scale + offsetX,
    y: offsetY - values[verticalAxis] * scale,
  };
}

export async function createModelMask({
  url,
  width,
  height,
  padding = 0.12,
}: CreateModelMaskOptions): Promise<ModelMask> {
  const cacheKey = `${url}:${Math.round(width)}x${Math.round(height)}:${padding.toFixed(3)}`;

  if (maskCache.has(cacheKey)) {
    return maskCache.get(cacheKey)!;
  }

  const maskPromise = createModelMaskUncached({ url, width, height, padding });
  maskCache.set(cacheKey, maskPromise);

  try {
    return await maskPromise;
  } catch (error) {
    maskCache.delete(cacheKey);
    throw error;
  }
}

async function createModelMaskUncached({
  url,
  width,
  height,
  padding = 0.12,
}: CreateModelMaskOptions): Promise<ModelMask> {
  const { THREE } = await getModules();
  const root = await getModel(url);
  root.updateMatrixWorld(true);

  const bounds = new THREE.Box3().setFromObject(root);
  const size = bounds.getSize(new THREE.Vector3());

  if (size.lengthSq() === 0) {
    throw new Error(`Model "${url}" has no measurable bounds.`);
  }

  const axisSizes = [size.x, size.y, size.z];
  const hiddenAxis = axisSizes.indexOf(Math.min(...axisSizes)) as 0 | 1 | 2;
  const visibleAxes =
    hiddenAxis === 0 ? ([2, 1] as const) : hiddenAxis === 1 ? ([0, 2] as const) : ([0, 1] as const);
  const [horizontalAxis, verticalAxis] = visibleAxes;
  const minValues = [bounds.min.x, bounds.min.y, bounds.min.z];
  const maxValues = [bounds.max.x, bounds.max.y, bounds.max.z];
  const projectedWidth = Math.max(
    maxValues[horizontalAxis] - minValues[horizontalAxis],
    0.001,
  );
  const projectedHeight = Math.max(
    maxValues[verticalAxis] - minValues[verticalAxis],
    0.001,
  );
  const projectedCenterX = (maxValues[horizontalAxis] + minValues[horizontalAxis]) * 0.5;
  const projectedCenterY = (maxValues[verticalAxis] + minValues[verticalAxis]) * 0.5;
  const maskScale = 2;
  const maskWidth = Math.max(Math.round(width * maskScale), 1);
  const maskHeight = Math.max(Math.round(height * maskScale), 1);
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d", { willReadFrequently: true });

  if (!context) {
    throw new Error("Could not create canvas context for GLB mask.");
  }

  canvas.width = maskWidth;
  canvas.height = maskHeight;

  context.setTransform(maskScale, 0, 0, maskScale, 0, 0);
  context.clearRect(0, 0, width, height);
  context.fillStyle = "#ffffff";

  const safeWidth = width * (1 - padding * 2);
  const safeHeight = height * (1 - padding * 2);
  const scale = Math.min(safeWidth / projectedWidth, safeHeight / projectedHeight);
  const offsetX = width * 0.5 - projectedCenterX * scale;
  const offsetY = height * 0.5 + projectedCenterY * scale;
  const pointA = new THREE.Vector3();
  const pointB = new THREE.Vector3();
  const pointC = new THREE.Vector3();

  root.traverse((node) => {
    if (!(node instanceof THREE.Mesh) || !node.geometry) {
      return;
    }

    const geometry = node.geometry;
    const position = geometry.attributes.position;

    if (!position) {
      return;
    }

    const indices = geometry.index?.array;
    const triangleCount = indices ? indices.length / 3 : position.count / 3;

    for (let triangle = 0; triangle < triangleCount; triangle += 1) {
      const baseIndex = triangle * 3;
      const indexA = indices ? indices[baseIndex] : baseIndex;
      const indexB = indices ? indices[baseIndex + 1] : baseIndex + 1;
      const indexC = indices ? indices[baseIndex + 2] : baseIndex + 2;

      pointA.fromBufferAttribute(position, indexA).applyMatrix4(node.matrixWorld);
      pointB.fromBufferAttribute(position, indexB).applyMatrix4(node.matrixWorld);
      pointC.fromBufferAttribute(position, indexC).applyMatrix4(node.matrixWorld);

      const projectedA = projectVector(
        pointA,
        scale,
        offsetX,
        offsetY,
        horizontalAxis,
        verticalAxis,
      );
      const projectedB = projectVector(
        pointB,
        scale,
        offsetX,
        offsetY,
        horizontalAxis,
        verticalAxis,
      );
      const projectedC = projectVector(
        pointC,
        scale,
        offsetX,
        offsetY,
        horizontalAxis,
        verticalAxis,
      );

      context.beginPath();
      context.moveTo(projectedA.x, projectedA.y);
      context.lineTo(projectedB.x, projectedB.y);
      context.lineTo(projectedC.x, projectedC.y);
      context.closePath();
      context.fill();
    }
  });

  return {
    image: context.getImageData(0, 0, maskWidth, maskHeight),
    maskWidth,
    maskHeight,
    maskScale,
  };
}
