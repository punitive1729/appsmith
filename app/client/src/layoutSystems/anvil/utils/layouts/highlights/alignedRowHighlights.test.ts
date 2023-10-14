import { generateAlignedRowMock } from "mocks/layoutComponents/layoutComponentMock";
import type {
  AnvilHighlightInfo,
  LayoutComponentProps,
  WidgetLayoutProps,
} from "../../anvilTypes";
import type {
  WidgetPosition,
  WidgetPositions,
} from "layoutSystems/common/types";
import { deriveAlignedRowHighlights } from "./alignedRowHighlights";
import {
  FlexLayerAlignment,
  ResponsiveBehavior,
} from "layoutSystems/common/utils/constants";
import {
  HIGHLIGHT_SIZE,
  HORIZONTAL_DROP_ZONE_MULTIPLIER,
} from "../../constants";
import { registerLayoutComponents } from "../layoutUtils";
import LayoutFactory from "layoutSystems/anvil/layoutComponents/LayoutFactory";
import AlignedRow from "layoutSystems/anvil/layoutComponents/components/AlignedRow";

describe("AlignedRow highlights", () => {
  beforeAll(() => {
    LayoutFactory.initialize([AlignedRow]);
  });
  describe("initial highlights", () => {
    it("should return three initial highlights if layout is empty", () => {
      const layout: LayoutComponentProps = generateAlignedRowMock({
        layout: [],
      });
      const { layoutId } = layout;

      const startPosition: WidgetPosition = {
        height: 40,
        left: 0,
        top: 0,
        width: 400,
      };
      const centerPosition: WidgetPosition = {
        height: 40,
        left: 404,
        top: 0,
        width: 400,
      };
      const endPosition: WidgetPosition = {
        height: 40,
        left: 808,
        top: 0,
        width: 400,
      };
      const dimensions: WidgetPositions = {
        [layoutId]: { height: 40, left: 0, top: 0, width: 1208 },
        [`${layoutId}-0`]: startPosition,
        [`${layoutId}-1`]: centerPosition,
        [`${layoutId}-2`]: endPosition,
      };

      const res: AnvilHighlightInfo[] = deriveAlignedRowHighlights(
        layout,
        dimensions,
        "0",
        [
          {
            widgetId: "10",
            type: "BUTTON_WIDGET",
            responsiveBehavior: ResponsiveBehavior.Hug,
          },
        ],
        [],
      );

      expect(res.length).toEqual(3);

      expect(res[0].alignment).toEqual(FlexLayerAlignment.Start);
      expect(res[0].posX).toEqual(startPosition.left + HIGHLIGHT_SIZE / 2);
      expect(res[0].posY).toEqual(startPosition.top);
      expect(res[0].height).toEqual(startPosition.height);
      expect(res[0].dropZone.left).toEqual(res[0].posX);

      expect(res[1].alignment).toEqual(FlexLayerAlignment.Center);
      expect(res[1].posX).toEqual(
        centerPosition.left + (centerPosition.width - HIGHLIGHT_SIZE) / 2,
      );
      expect(res[1].posY).toEqual(centerPosition.top);
      expect(res[1].height).toEqual(centerPosition.height);
      expect(res[1].dropZone.left).toEqual(
        (res[1].posX - res[0].posX) * HORIZONTAL_DROP_ZONE_MULTIPLIER,
      );
      expect(res[0].dropZone.right).toEqual(res[1].dropZone.left);

      expect(res[2].alignment).toEqual(FlexLayerAlignment.End);
      expect(res[2].posX).toEqual(
        dimensions[layoutId].left + dimensions[layoutId].width - HIGHLIGHT_SIZE,
      );
      expect(res[2].posY).toEqual(centerPosition.top);
      expect(res[2].height).toEqual(centerPosition.height);
      expect(res[2].dropZone.left).toEqual(
        (res[2].posX - res[1].posX) * HORIZONTAL_DROP_ZONE_MULTIPLIER,
      );
      expect(res[1].dropZone.right).toEqual(res[2].dropZone.left);
    });
  });

  describe("fill child widget", () => {
    it.only("should not render highlights for alignments", () => {
      const layout: LayoutComponentProps = generateAlignedRowMock();
      const { layoutId } = layout;

      const button: string = (layout.layout[0] as WidgetLayoutProps).widgetId;
      const input: string = (layout.layout[1] as WidgetLayoutProps).widgetId;

      const layoutPosition: WidgetPosition = {
        height: 78,
        left: 0,
        top: 0,
        width: 1208,
      };

      const dimensions: WidgetPositions = {
        [layoutId]: layoutPosition,
        [button]: { height: 40, left: 10, top: 4, width: 120 },
        [input]: { height: 70, left: 140, top: 4, width: 1058 },
      };

      const res: AnvilHighlightInfo[] = deriveAlignedRowHighlights(
        layout,
        dimensions,
        "0",
        [
          {
            widgetId: "10",
            type: "BUTTON_WIDGET",
            responsiveBehavior: ResponsiveBehavior.Hug,
          },
        ],
        [],
      );

      expect(res.length).toEqual(3);

      expect(res[0].alignment).toEqual(FlexLayerAlignment.Start);
      expect(res[0].posX).toEqual(dimensions[button].left - HIGHLIGHT_SIZE / 2);
      expect(res[0].posY).toEqual(dimensions[button].top);
      expect(res[0].height).toEqual(dimensions[input].height);
      expect(res[0].dropZone.left).toEqual(dimensions[button].left);

      expect(res[1].alignment).toEqual(FlexLayerAlignment.Start);
      expect(res[1].posX).toEqual(dimensions[input].left - HIGHLIGHT_SIZE / 2);
      expect(res[1].posY).toEqual(dimensions[input].top);
      expect(res[1].height).toEqual(dimensions[input].height);
      expect(res[1].dropZone.left).toEqual(res[0].dropZone.right);
      expect(res[1].dropZone.left).toEqual(
        (res[1].posX - res[0].posX) * HORIZONTAL_DROP_ZONE_MULTIPLIER,
      );

      expect(res[2].alignment).toEqual(FlexLayerAlignment.Start);
      expect(res[2].posX).toEqual(
        dimensions[input].left + dimensions[input].width + HIGHLIGHT_SIZE / 2,
      );
      expect(res[2].posY).toEqual(dimensions[input].top);
      expect(res[2].height).toEqual(dimensions[input].height);
      expect(res[2].dropZone.left).toEqual(
        Math.floor(
          (res[2].posX - res[1].posX) * HORIZONTAL_DROP_ZONE_MULTIPLIER,
        ),
      );
    });
  });
});
