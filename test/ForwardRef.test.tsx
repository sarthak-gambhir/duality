import { createRef } from "react";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MultiSelect } from "../src/components/multi_select/MultiSelect";
import { DatePicker } from "../src/components/date_picker/DatePicker";
import { TimePicker } from "../src/components/time_picker/TimePicker";
import { TagInput } from "../src/components/tag_input/TagInput";
import { PinInput } from "../src/components/pin_input/PinInput";
import { FileUpload } from "../src/components/file_upload/FileUpload";
import { RangeSlider } from "../src/components/range_slider/RangeSlider";
import { Tree } from "../src/components/tree/Tree";

const options = [{ value: "a", label: "Apple" }];

describe("forwardRef smoke tests", () => {
  it("MultiSelect forwards its ref to the input", () => {
    const ref = createRef<HTMLInputElement>();
    render(<MultiSelect aria-label="x" options={options} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("DatePicker forwards its ref to the trigger button", () => {
    const ref = createRef<HTMLButtonElement>();
    render(<DatePicker aria-label="x" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("TimePicker forwards its ref to the trigger button", () => {
    const ref = createRef<HTMLButtonElement>();
    render(<TimePicker aria-label="x" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("TagInput forwards its ref to the input", () => {
    const ref = createRef<HTMLInputElement>();
    render(<TagInput aria-label="x" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("PinInput forwards its ref to the first cell", () => {
    const ref = createRef<HTMLInputElement>();
    render(<PinInput aria-label="x" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("FileUpload forwards its ref to the hidden file input", () => {
    const ref = createRef<HTMLInputElement>();
    render(<FileUpload ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current?.type).toBe("file");
  });

  it("RangeSlider forwards its ref to the root element", () => {
    const ref = createRef<HTMLDivElement>();
    render(<RangeSlider ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("Tree forwards its ref to the root list", () => {
    const ref = createRef<HTMLUListElement>();
    render(<Tree items={[{ id: "1", label: "One" }]} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLUListElement);
  });
});
