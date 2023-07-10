const configValue = {
  BASE_FEE: 1, // 5% per month
} as const


export const config = (key: keyof typeof configValue) => configValue[key]