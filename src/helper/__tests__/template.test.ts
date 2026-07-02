import { describe, expect, it } from "vitest"
import { extractVariables, renderTemplate } from "../template"

describe("Template helper", () => {
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

  describe("extractVariables", () => {
    it("returns a single variable", () => {
      expect(extractVariables("Classify this ticket: {{ticket}}")).toEqual(["ticket"])
    })

    it("returns multiple variables in order of appearance", () => {
      expect(extractVariables("Classify this ticket: {{ticket}} for a {{role}}")).toEqual(["ticket", "role"])
    })

    it("deduplicates repeated variables", () => {
      expect(extractVariables("Classify this ticket: {{ticket}} for a {{role}} and repeat {{ticket}}")).toEqual(["ticket", "role"])
    })

    it("returns an empty array when there are no variables", () => {
      expect(extractVariables("No placeholders here")).toEqual([])
    })

    it("returns an empty array for an empty string", () => {
      expect(extractVariables("")).toEqual([])
    })
  })
})
