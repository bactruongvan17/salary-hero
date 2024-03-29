import moment from 'moment'

/**
 * Random a number
 * @param min number
 * @param max number
 * @returns number
 */
export function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Random element in array
 * @param array T[]
 * @returns T
 */
export function randomElementInArray<T>(array: T[]): T {
  const randomIdx = Math.floor(Math.random() * array.length)
  return array[randomIdx]
}

/**
 * Validate date string format is valid
 * @param dateString string
 * @param format string
 * @returns boolean
 */
export function validateDateFormat(dateString: string, format: string = 'YYYY-MM-DD'): boolean {
  const parsedDate = moment(dateString, format, true)
  return parsedDate.isValid()
}

/**
 * Convert object camelcase to snakecase
 * @param obj
 * @returns
 */
export function camelToSnake(obj: Record<string, any>): Record<string, any> {
  const snakeCaseObj: Record<string, any> = {}
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
      snakeCaseObj[snakeKey] = obj[key]
    }
  }
  return snakeCaseObj
}
