import { logger, LogLevel } from './logger'

describe('Logger', () => {
  let consoleDebugSpy: jest.SpyInstance
  let consoleInfoSpy: jest.SpyInstance
  let consoleWarnSpy: jest.SpyInstance
  let consoleErrorSpy: jest.SpyInstance

  beforeEach(() => {
    jest.clearAllMocks()
    consoleDebugSpy = jest.spyOn(console, 'debug').mockImplementation()
    consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation()
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation()
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
  })

  afterEach(() => {
    consoleDebugSpy.mockRestore()
    consoleInfoSpy.mockRestore()
    consoleWarnSpy.mockRestore()
    consoleErrorSpy.mockRestore()
  })

  describe('debug', () => {
    it('should log debug message', () => {
      logger.debug('Debug message')

      expect(consoleDebugSpy).toHaveBeenCalledTimes(1)
      const logCall = consoleDebugSpy.mock.calls[0][0]
      const logData = JSON.parse(logCall)
      expect(logData.message).toBe('Debug message')
      expect(logData.level).toBe(LogLevel.DEBUG)
      expect(logData.timestamp).toBeDefined()
    })

    it('should log debug message with context', () => {
      logger.debug('Debug message', { key: 'value' })

      const logCall = consoleDebugSpy.mock.calls[0][0]
      const logData = JSON.parse(logCall)
      expect(logData.context).toEqual({ key: 'value' })
    })
  })

  describe('info', () => {
    it('should log info message', () => {
      logger.info('Info message')

      expect(consoleInfoSpy).toHaveBeenCalledTimes(1)
      const logCall = consoleInfoSpy.mock.calls[0][0]
      const logData = JSON.parse(logCall)
      expect(logData.message).toBe('Info message')
      expect(logData.level).toBe(LogLevel.INFO)
    })

    it('should log info message with context', () => {
      logger.info('Info message', { userId: '123' })

      const logCall = consoleInfoSpy.mock.calls[0][0]
      const logData = JSON.parse(logCall)
      expect(logData.context).toEqual({ userId: '123' })
    })
  })

  describe('warn', () => {
    it('should log warn message', () => {
      logger.warn('Warning message')

      expect(consoleWarnSpy).toHaveBeenCalledTimes(1)
      const logCall = consoleWarnSpy.mock.calls[0][0]
      const logData = JSON.parse(logCall)
      expect(logData.message).toBe('Warning message')
      expect(logData.level).toBe(LogLevel.WARN)
    })

    it('should log warn message with Error object', () => {
      const error = new Error('Test error')
      logger.warn('Warning message', error)

      const logCall = consoleWarnSpy.mock.calls[0][0]
      const logData = JSON.parse(logCall)
      expect(logData.context.error).toEqual({
        name: 'Error',
        message: 'Test error',
        stack: expect.any(String)
      })
    })

    it('should log warn message with context and error', () => {
      const error = new Error('Test error')
      logger.warn('Warning message', error, { userId: '123' })

      const logCall = consoleWarnSpy.mock.calls[0][0]
      const logData = JSON.parse(logCall)
      expect(logData.context.error).toBeDefined()
      expect(logData.context.userId).toBe('123')
    })

    it('should log warn message with non-Error object', () => {
      logger.warn('Warning message', 'string error')

      const logCall = consoleWarnSpy.mock.calls[0][0]
      const logData = JSON.parse(logCall)
      expect(logData.context.error).toBe('string error')
    })
  })

  describe('error', () => {
    it('should log error message', () => {
      logger.error('Error message')

      expect(consoleErrorSpy).toHaveBeenCalledTimes(1)
      const logCall = consoleErrorSpy.mock.calls[0][0]
      const logData = JSON.parse(logCall)
      expect(logData.message).toBe('Error message')
      expect(logData.level).toBe(LogLevel.ERROR)
    })

    it('should log error message with Error object', () => {
      const error = new Error('Test error')
      logger.error('Error message', error)

      const logCall = consoleErrorSpy.mock.calls[0][0]
      const logData = JSON.parse(logCall)
      expect(logData.context.error).toEqual({
        name: 'Error',
        message: 'Test error',
        stack: expect.any(String)
      })
    })

    it('should log error message with context and error', () => {
      const error = new Error('Test error')
      logger.error('Error message', error, { userId: '123' })

      const logCall = consoleErrorSpy.mock.calls[0][0]
      const logData = JSON.parse(logCall)
      expect(logData.context.error).toBeDefined()
      expect(logData.context.userId).toBe('123')
    })

    it('should log error message with non-Error object', () => {
      logger.error('Error message', 'string error')

      const logCall = consoleErrorSpy.mock.calls[0][0]
      const logData = JSON.parse(logCall)
      expect(logData.context.error).toBe('string error')
    })
  })
})
