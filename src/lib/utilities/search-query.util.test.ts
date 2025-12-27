import { validateSearchQuery, buildSearchFilter } from './search-query.util'
import { ilike, or } from 'drizzle-orm'

// Mock drizzle-orm
jest.mock('drizzle-orm', () => ({
  ilike: jest.fn((column, pattern) => ({ type: 'ilike', column, pattern })),
  or: jest.fn((...conditions) => ({ type: 'or', conditions }))
}))

jest.mock('../constants/app.constants', () => ({
  SEARCH_CONFIG: {
    MIN_QUERY_LENGTH: 1,
    MAX_QUERY_LENGTH: 100
  }
}))

describe('validateSearchQuery', () => {
  it('should return undefined for null', () => {
    expect(validateSearchQuery(null)).toBeUndefined()
  })

  it('should return undefined for undefined', () => {
    expect(validateSearchQuery(undefined)).toBeUndefined()
  })

  it('should return undefined for empty string', () => {
    expect(validateSearchQuery('')).toBeUndefined()
  })

  it('should return undefined for non-string', () => {
    expect(validateSearchQuery(123 as unknown as string)).toBeUndefined()
  })

  it('should trim whitespace', () => {
    expect(validateSearchQuery('  test  ')).toBe('test')
  })

  it('should return undefined if query is too short', () => {
    // With MIN_QUERY_LENGTH of 1, empty string after trim should be undefined
    expect(validateSearchQuery('   ')).toBeUndefined()
  })

  it('should truncate query if too long', () => {
    const longQuery = 'a'.repeat(150)
    const result = validateSearchQuery(longQuery)
    expect(result?.length).toBe(100)
  })

  it('should sanitize dangerous characters', () => {
    const result = validateSearchQuery("test<>\"''search")
    expect(result).toBe('testsearch')
  })

  it('should return undefined if sanitized result is empty', () => {
    expect(validateSearchQuery('<>\'"')).toBeUndefined()
  })

  it('should return valid query', () => {
    expect(validateSearchQuery('valid search')).toBe('valid search')
  })
})

describe('buildSearchFilter', () => {
  const mockColumns = [{ name: 'title' }, { name: 'description' }] as unknown[]

  it('should return undefined if no search query', () => {
    expect(buildSearchFilter(undefined, mockColumns as never)).toBeUndefined()
  })

  it('should return undefined if empty columns array', () => {
    expect(buildSearchFilter('test', [])).toBeUndefined()
  })

  it('should build filter with single column', () => {
    const singleColumn = [{ name: 'title' }] as unknown[]
    const result = buildSearchFilter('test', singleColumn as never)

    expect(ilike).toHaveBeenCalledWith(singleColumn[0], '%test%')
    expect(result).toBeDefined()
  })

  it('should build filter with multiple columns using or', () => {
    const result = buildSearchFilter('test', mockColumns as never)

    expect(ilike).toHaveBeenCalledTimes(2)
    expect(or).toHaveBeenCalled()
    expect(result).toBeDefined()
  })
})
