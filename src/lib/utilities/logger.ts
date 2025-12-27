/**
 * Structured logger utility
 * Provides consistent logging across the application
 */

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error'
}

interface LogContext {
  [key: string]: unknown
}

class Logger {
  private log(level: LogLevel, message: string, context?: LogContext): void {
    const timestamp = new Date().toISOString()
    const logEntry = {
      timestamp,
      level,
      message,
      ...(context && { context })
    }

    // INFO: In production, might want to send to a logging service
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(JSON.stringify(logEntry))
        break
      case LogLevel.INFO:
        console.info(JSON.stringify(logEntry))
        break
      case LogLevel.WARN:
        console.warn(JSON.stringify(logEntry))
        break
      case LogLevel.ERROR:
        console.error(JSON.stringify(logEntry))
        break
    }
  }

  debug(message: string, context?: LogContext): void {
    this.log(LogLevel.DEBUG, message, context)
  }

  info(message: string, context?: LogContext): void {
    this.log(LogLevel.INFO, message, context)
  }

  warn(message: string, error?: Error | unknown, context?: LogContext): void {
    const warnContext: LogContext = {
      ...(context || {}),
      ...(error
        ? {
            error:
              error instanceof Error
                ? {
                    name: error.name,
                    message: error.message,
                    stack: error.stack
                  }
                : String(error)
          }
        : {})
    }
    this.log(LogLevel.WARN, message, warnContext)
  }

  error(message: string, error?: Error | unknown, context?: LogContext): void {
    const errorContext: LogContext = {
      ...(context || {}),
      error:
        error instanceof Error
          ? {
              name: error.name,
              message: error.message,
              stack: error.stack
            }
          : String(error)
    }
    this.log(LogLevel.ERROR, message, errorContext)
  }
}

export const logger = new Logger()
