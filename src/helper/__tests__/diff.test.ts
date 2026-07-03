import { describe, expect, it } from "vitest"
import { diffField, mergeTemplate } from "../diff"

describe("diff", () => {
  describe("diffField", () => {
    it("returns 'unchanged' when neither upstream nor customer changed", () => {
      expect(diffField("spencer", "spencer", "spencer")).toBe("unchanged")
    })

    it("returns 'upstream-only' when only upstream changed", () => {
      expect(diffField("spencer", "spencer upstream", "spencer")).toBe("upstream-only")
    })

    it("returns 'customer-only' when only customer changed", () => {
      expect(diffField("spencer", "spencer", "spencer customer")).toBe("customer-only")
    })

    it("returns 'conflict' when both upstream and customer changed", () => {
      expect(diffField("spencer", "spencer upstream", "spencer customer")).toBe("conflict")
    })

    it("returns 'conflict' when both changed to the same value", () => {
      expect(diffField("spencer", "john", "john")).toBe("conflict")
    })
  })

  describe("mergeTemplate", () => {
    it("returns ok with original when nothing changed", () => {
      const result = mergeTemplate("line1\nline2", "line1\nline2", "line1\nline2")
      expect(result).toEqual({ ok: true, result: "line1\nline2" })
    })

    it("returns ok with upstream change when only upstream changed", () => {
      const result = mergeTemplate("line1\nline2", "line1\nupdated", "line1\nline2")
      expect(result).toEqual({ ok: true, result: "line1\nupdated" })
    })

    it("returns ok with customer change when only customer changed", () => {
      const result = mergeTemplate("line1\nline2", "line1\nline2", "line1\ncustom")
      expect(result).toEqual({ ok: true, result: "line1\ncustom" })
    })

    it("returns ok merging non-overlapping changes from both sides", () => {
      const base = "line1\nline2\nline3"
      const upstream = "updated1\nline2\nline3"
      const customer = "line1\nline2\ncustom3"
      const result = mergeTemplate(base, upstream, customer)
      expect(result).toEqual({ ok: true, result: "updated1\nline2\ncustom3" })
    })

    it("returns conflict hunks when both sides changed the same line differently", () => {
      const result = mergeTemplate("line1", "upstream edit", "customer edit")
      expect(result.ok).toBe(false)
      if (!result.ok) {
        expect(result.hunks).toContainEqual({
          type: "conflict",
          upstream: ["upstream edit"],
          customer: ["customer edit"]
        })
      }
    })

    it("returns ok with empty result when base, upstream and customer are all empty", () => {
      const result = mergeTemplate("", "", "")
      expect(result).toEqual({ ok: true, result: "" })
    })
  })
})

