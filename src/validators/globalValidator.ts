export type ValidationResult = {
  error: boolean
  status: number
  message: string
}

export type ValidationFunc<T> = (data: T) => ValidationResult | Promise<ValidationResult>

export async function validate<T extends any>(data: T, cbs: ValidationFunc<T>[]) {
  const results: ValidationResult[] = []

  for (let cb of cbs) {
    const result = await cb(data)

    results.push(result)
  }

  return results.find(item => item.error) || ({} as ValidationResult)
}
