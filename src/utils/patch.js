import { SkeletonRenderer, SpinePlayer } from "@esotericsoftware/spine-player";

const draw = SkeletonRenderer.prototype.draw;
SkeletonRenderer.prototype.draw = function (batcher, skeleton, slotRangeStart = -1, slotRangeEnd = -1) {
  for (let i = 0, n = skeleton.drawOrder.length; i < n; i++) {
    let slot = skeleton.drawOrder[i];
    if (slot.color) {
      slot.color.r = 1;
      slot.color.g = 1;
      slot.color.b = 1;
    }
  }
  draw.call(this, batcher, skeleton, slotRangeStart, slotRangeEnd);
};

const drawFrame = SpinePlayer.prototype.drawFrame;
SpinePlayer.prototype.drawFrame = function (requestNextFrame = true) {
  if (!requestNextFrame || this.disposed || this.error || this.stopRequestAnimationFrame) {
    drawFrame.call(this, requestNextFrame);
    return;
  }
  const targetFPS = window.WEconfigs && window.WEconfigs.fps;
  if (targetFPS) {
    const interval = 1.0 / targetFPS;
    if (!this.last) this.last = performance.now() / 1000;
    if (!this.fpsThreshold) this.fpsThreshold = 0;
    const now = performance.now() / 1000;
    if (!this._lastDrawTime) {
      this._lastDrawTime = now;
    }
    const elapsed = now - this._lastDrawTime;
    if (elapsed < interval) {
      requestAnimationFrame(() => this.drawFrame());
      return;
    }
    this._lastDrawTime = now - (elapsed % interval);
  }
  drawFrame.call(this, requestNextFrame);
};
