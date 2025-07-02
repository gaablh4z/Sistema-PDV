import '@testing-library/jest-dom'
import { afterEach, beforeEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

// Limpa o DOM após cada teste
afterEach(() => {
  cleanup()
})

// Mock do localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Mock do window.alert
Object.defineProperty(window, 'alert', {
  value: vi.fn(),
})

// Mock do window.confirm
Object.defineProperty(window, 'confirm', {
  value: vi.fn(() => true),
})

// Mock do window.prompt
Object.defineProperty(window, 'prompt', {
  value: vi.fn(),
})

// Mock do console.error para testes mais limpos
Object.defineProperty(console, 'error', {
  value: vi.fn(),
})

// Mock do Date para testes consistentes
const mockDate = new Date('2025-07-02T10:00:00.000Z')
vi.setSystemTime(mockDate)

// Limpar todos os mocks antes de cada teste
beforeEach(() => {
  vi.clearAllMocks()
})
