const tokenBlackList: Set<string> = new Set()

export const isTokenBlackList = (token: string) => {
  return new Promise<boolean>((resolve, reject) => {
    resolve(tokenBlackList.has(token))
  })
}

export const addTokenBlackList = (token: string) => {
  tokenBlackList.add(token)
}
