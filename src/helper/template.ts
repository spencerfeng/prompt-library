export const renderTemplate = (template: string, vars: Record<string, string>) => {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? `{{${key}}}`)
}

export const extractVariables = (template: string) => {
  const matches = [...template.matchAll(/\{\{(\w+)\}\}/g)]
  return [...new Set(matches.map((m) => m[1]))]
}
