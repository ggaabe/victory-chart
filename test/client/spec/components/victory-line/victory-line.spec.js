/**
 * Client tests
 */
/* global sinon */
/*eslint-disable max-nested-callbacks */
/* eslint no-unused-expressions: 0 */

import React from "react";
import { omit } from "lodash";
import { shallow, mount } from "enzyme";
import SvgTestHelper from "../../../../svg-test-helper";
import VictoryLine from "src/components/victory-line/victory-line";
import Line from "src/components/victory-line/line-segment";
import { VictoryLabel } from "victory-core";

class MyLineSegment extends React.Component {
  render() { }
}

describe("components/victory-line", () => {
  describe("default component rendering", () => {
    it("renders an svg with the correct width and height", () => {
      const wrapper = mount(
        <VictoryLine/>
      );
      const svg = wrapper.find("svg");
      expect(svg.prop("style").width).to.equal("100%");
      expect(svg.prop("style").height).to.equal("auto");
    });

    it("renders an svg with the correct viewBox", () => {
      const wrapper = mount(
        <VictoryLine/>
      );
      const svg = wrapper.find("svg");
      const viewBoxValue =
        `0 0 ${VictoryLine.defaultProps.width} ${VictoryLine.defaultProps.height}`;
      expect(svg.prop("viewBox")).to.equal(viewBoxValue);
    });
  });

  describe("rendering with data", () => {
    it("renders one dataComponent for the line", () => {
      const data = [
        {x: 1, y: 1},
        {x: 2, y: 4},
        {x: 3, y: 5},
        {x: 4, y: 2},
        {x: 5, y: 3},
        {x: 6, y: 4},
        {x: 7, y: 6}
      ];
      const wrapper = shallow(
        <VictoryLine
          data={data}
          dataComponent={<MyLineSegment />}
        />
      );

      const lines = wrapper.find(MyLineSegment);
      expect(lines.length).to.equal(1);
    });

    it("renders one line segment for the line", () => {
      const data = [
        {x: 1, y: 1},
        {x: 2, y: 4},
        {x: 3, y: 5},
        {x: 4, y: 2},
        {x: 5, y: 3},
        {x: 6, y: 4},
        {x: 7, y: 6}
      ];
      const wrapper = shallow(
        <VictoryLine data={data}/>
      );
      const lines = wrapper.find(Line);
      expect(lines.length).to.equal(1);
    });

    it("renders the correct d3Shape path", () => {
      const props = {
        interpolation: "linear",
        scale: "linear",
        padding: 50,
        width: 400,
        height: 300,
        data: [{x: 0, y: 0}, {x: 1, y: 1}, {x: 2, y: 2}]
      };
      const wrapper = shallow(
        <VictoryLine {...props}/>
      );
      const line = wrapper.find(Line);
      SvgTestHelper.expectCorrectD3Path(line, props, "line");
    });
  });

  describe("rendering with null data", () => {
    it("renders two line segments when there are two continuous sections of data", () => {
      const data = [
        {x: 1, y: 1},
        {x: 2, y: 4},
        {x: 3, y: 5},
        {x: 4, y: 2},
        {x: 5, y: null},
        {x: 6, y: 4},
        {x: 7, y: 6}
      ];
      const wrapper = shallow(
        <VictoryLine data={data}/>
      );
      const lines = wrapper.find(Line);
      expect(lines.length).to.equal(2);
    });

    it("renders two lines for two continuous sections of data with multiple nulls", () => {
      const data = [
        {x: 1, y: 1},
        {x: 2, y: 4},
        {x: 3, y: 5},
        {x: 4, y: null},
        {x: 5, y: null},
        {x: 6, y: 4},
        {x: 7, y: 6}
      ];
      const wrapper = shallow(
        <VictoryLine data={data}/>
      );
      const lines = wrapper.find(Line);
      expect(lines.length).to.equal(2);
    });

    it("renders two lines for two sections of data with multiple nulls out of order", () => {
      const data = [
        {x: 1, y: 1},
        {x: 2, y: 4},
        {x: 4, y: null},
        {x: 3, y: 5},
        {x: 5, y: null},
        {x: 6, y: 4},
        {x: 7, y: 6}
      ];
      const wrapper = shallow(
        <VictoryLine data={data}/>
      );
      const lines = wrapper.find(Line);
      expect(lines.length).to.equal(2);
    });

    it("renders two lines for two sections of data with starting/ending nulls", () => {
      const data = [
        {x: 1, y: null},
        {x: 2, y: 4},
        {x: 3, y: 3},
        {x: 4, y: null},
        {x: 5, y: 2},
        {x: 6, y: 4},
        {x: 7, y: null}
      ];
      const wrapper = shallow(
        <VictoryLine data={data}/>
      );
      const lines = wrapper.find(Line);
      expect(lines.length).to.equal(2);
    });

    it("renders three lines for three continuous sections of data", () => {
      const data = [
        {x: 1, y: 2},
        {x: 2, y: 4},
        {x: 3, y: null},
        {x: 4, y: 4},
        {x: 5, y: 2},
        {x: 6, y: null},
        {x: 7, y: 5},
        {x: 8, y: 3}
      ];
      const wrapper = shallow(
        <VictoryLine data={data}/>
      );
      const lines = wrapper.find(Line);
      expect(lines.length).to.equal(3);
    });
  });

  describe("rendering with accessors", () => {
    it("renders array-type data", () => {
      const data = [
        [1, 2],
        [3, 4]
      ];
      const wrapper = shallow(
        <VictoryLine data={data} x={0} y={1} />
      );
      const lines = wrapper.find(Line);
      expect(lines.length).to.equal(1);
    });

    it("renders data values with null accessor", () => {
      const data = [1, 2, 3, 4];
      const wrapper = shallow(
        <VictoryLine data={data} x={null} y={null} />
      );
      const lines = wrapper.find(Line);
      expect(lines.length).to.equal(1);
    });

    it("renders deeply nested data", () => {
      const data = [
        {a: {b: [{x: 1, y: 2}]}},
        {a: {b: [{x: 3, y: 4}]}}
      ];
      const wrapper = shallow(
        <VictoryLine data={data} x={'a.b[0].x'} y={'a.b.0.y'} />
      );
      const lines = wrapper.find(Line);
      expect(lines.length).to.equal(1);
    });
  });

  describe("event handling", () => {
    it("attaches an event to the parent svg", () => {
      const clickHandler = sinon.spy();
      const wrapper = mount(
        <VictoryLine
          events={[{
            target: "parent",
            eventHandlers: {onClick: clickHandler}
          }]}
        />
      );
      const svg = wrapper.find("svg");
      svg.simulate("click");
      expect(clickHandler).called;
      // the first argument is the standard evt object
      expect(clickHandler.args[0][1])
        .to.include.keys("data", "scale", "width", "height", "style");
    });

    it("attaches an event to data", () => {
      const clickHandler = sinon.spy();
      const wrapper = mount(
        <VictoryLine
          events={[{
            target: "data",
            eventHandlers: {onClick: clickHandler}
          }]}
        />
      );
      const Data = wrapper.find(Line);
      Data.forEach((node, index) => {
        const initialProps = Data.at(index).props();
        node.simulate("click");
        expect(clickHandler.called).to.equal(true);
        // the first argument is the standard evt object
        expect(omit(clickHandler.args[index][1], ["events", "key"]))
          .to.eql(omit(initialProps, ["events", "key"]));
      });
    });

    it("attaches an event to a label", () => {
      const clickHandler = sinon.spy();
      const wrapper = mount(
        <VictoryLine
          label="okay"
          events={[{
            target: "labels",
            eventHandlers: {onClick: clickHandler}
          }]}
        />
      );
      const Labels = wrapper.find(VictoryLabel);
      Labels.forEach((node, index) => {
        node.childAt(0).simulate("click");
        expect(clickHandler).called;
        expect(clickHandler.args[index][1]).to.contain({text: "okay"});
      });
    });
  });
});
