export const getTempUserId = () => {
    let tempUserId = localStorage.getItem('tempUserId')
    if (!tempUserId) {
      tempUserId = 'temp_' + Math.random().toString(36).substring(2)
      localStorage.setItem('tempUserId', tempUserId)
    }
    return tempUserId
  }
  