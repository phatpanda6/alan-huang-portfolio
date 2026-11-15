// Use the same context attributes for the availability check and the scene.
export const webGLContextOptions = {
  powerPreference: "default",
  antialias: true,
  alpha: true,
  premultipliedAlpha: true,
  depth: true,
  stencil: false,
  failIfMajorPerformanceCaveat: false,
  preserveDrawingBuffer: false,
} satisfies WebGLContextAttributes;

export function canCreateWebGLContext(): boolean {
  try {
    const context = document
      .createElement("canvas")
      .getContext(
        "webgl2",
        webGLContextOptions,
      ) as WebGL2RenderingContext | null;
    if (!context || context.isContextLost()) {
      return false;
    }

    // The probe has no scene; release its graphics resources before loading 3D.
    context.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}
