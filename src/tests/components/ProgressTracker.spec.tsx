import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import ProgressTracker from "../../components/ProgressTracker";
import useIsSmallScreen from "../../hooks/useIsSmallScreen";
import {
  AnswerType,
  ProgressTrackerSectionType,
} from "../../state/FormContext";

jest.mock("../../hooks/useIsSmallScreen", () => jest.fn());

const mockSections: ProgressTrackerSectionType[] = [
  {
    sectionName: "Section 1",
    questions: [
      { name: "q1", label: "Question 1" },
      { name: "q2", label: "Question 2" },
    ],
  },
  {
    sectionName: "Section 2",
    questions: [{ name: "q3", label: "Question 3" }],
  },
];

const mockAnswers: AnswerType[] = [
  { name: "q1", isValid: true, value: "" },
  { name: "q2", isValid: false, value: "" },
  { name: "q3", isValid: true, value: "" },
];

describe("ProgressTracker", () => {
  beforeEach(() => {
    (useIsSmallScreen as jest.Mock).mockReturnValue(false);
  });

  test("renders correctly on larger screens", () => {
    render(
      <ProgressTracker
        sections={mockSections}
        answers={mockAnswers}
        currentSection={0}
        isLoading={false}
      />
    );

    expect(screen.getByText("Section 1")).toBeInTheDocument();
    expect(screen.getByText("Section 2")).toBeInTheDocument();

    expect(screen.getByText("Question 1")).toBeInTheDocument();
    expect(screen.getByText("Question 2")).toBeInTheDocument();
    expect(screen.getByText("Question 3")).toBeInTheDocument();

    const validIndicators = screen.getAllByText("✅");
    expect(validIndicators).toHaveLength(2);
    const invalidIndicators = screen.getAllByText("❌");
    expect(invalidIndicators).toHaveLength(1);

    expect(screen.getByText("Section 1")).toHaveClass("font-bold");

    expect(screen.getByText("Section 2")).not.toHaveClass("font-bold");
  });

  test("renders correctly on small screens", () => {
    (useIsSmallScreen as jest.Mock).mockReturnValue(true);

    render(
      <ProgressTracker
        sections={mockSections}
        answers={mockAnswers}
        currentSection={0}
        isLoading={false}
      />
    );

    const blocks = screen.getAllByRole("presentation");
    expect(blocks).toHaveLength(
      mockSections.flatMap((section) => section.questions).length
    );

    const blockClasses = blocks.map((block) => block.className);

    const expectedClasses = mockSections.flatMap((section) =>
      section.questions.map((question) => {
        const isValid = mockAnswers.find(
          (answer) => answer.name === question.name
        )?.isValid;
        return isValid ? "bg-green-500" : "bg-white";
      })
    );

    blockClasses.forEach((className, index) => {
      expect(className).toContain(expectedClasses[index]);
    });
  });

  test("applies font-bold class to the current section on larger screens", () => {
    render(
      <ProgressTracker
        sections={mockSections}
        answers={mockAnswers}
        currentSection={1}
        isLoading={false}
      />
    );

    expect(screen.getByText("Section 2")).toHaveClass("font-bold");

    expect(screen.getByText("Section 1")).not.toHaveClass("font-bold");
  });
});
