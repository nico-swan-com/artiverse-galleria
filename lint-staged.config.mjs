/* eslint-env node */

export default {
  '*': (filenames) => `prettier --check ${filenames.join(' ')}`
}
