

export const createCurrentDate = () => {
  const now = new Date()
  const date = Date.UTC(
    now.getUTCFullYear(), 
    now.getUTCMonth(), 
    now.getUTCDate(), 
    now.getUTCHours(), 
    now.getUTCMinutes(),
    now.getUTCSeconds(),
    0,
  )

  return {
    seconds: Math.round(date / 1000),
    nanos: 0,
  }
}