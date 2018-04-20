import { aliasFactory, aliasMark } from '../../src/factories/alias'

describe('aliasFactory', () => {
  const GET = aliasFactory('GET')
  const POST = aliasFactory('POST')

  it('produces aliases', () => {
     expect(GET).toBeTruthy()
     expect(POST).toBeTruthy()
    expect(GET()).not.toThrow()
    expect(POST()).not.toThrow()
  })

  it('leaves the mark', () => {
    expect(GET).toHaveProperty(aliasMark)
    expect(POST).toHaveProperty(aliasMark)

    expect(GET[aliasMark]).toBe('GET')
    expect(POST[aliasMark]).toBe('POST')
  })
})
