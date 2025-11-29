import { SkeletonRenderer } from "@esotericsoftware/spine-player";

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
