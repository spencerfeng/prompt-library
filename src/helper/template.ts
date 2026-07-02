export const renderTemplate = (template: string, vars: Record<string, string>) => {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? `{{${key}}}`)
}
