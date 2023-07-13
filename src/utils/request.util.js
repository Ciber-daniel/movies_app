/**
 * @returns {Promise<any>} action promise
 */
export const requestUtil = async ({ action, payload, loader, resolve, reject }) => {
  try {
    loader?.(true)
    const response = await action({ ...payload })

    resolve?.(response)
  } catch (e) {
    if (!reject) {
      return
    }

    reject?.(e)
  } finally {
    loader?.(false)
  }
}
