import { describe, expect, it } from "vitest"
import { renderTemplate } from "../template"

describe("renderTemplate", () => {
  it("replaces a single variable", () => {
    expect(renderTemplate("Classify this ticket: {{ticket}}", { ticket: "I was charged twice" })).toBe("Classify this ticket: I was charged twice")
  })

  it("replaces multiple variables", () => {
    expect(
      renderTemplate("Classify this ticket: {{ticket}} for a {{role}}", { ticket: "I was charged twice", role: "customer" })
    ).toBe("Classify this ticket: I was charged twice for a customer")
  })

  it("preserves placeholder when key is missing from vars", () => {
    expect(renderTemplate("Classify this ticket: {{ticket}}", {})).toBe("Classify this ticket: {{ticket}}")
  })
})
