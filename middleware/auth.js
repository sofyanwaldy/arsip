export default function({ store, error }) {
  if (!store.state.authUser) {
    error({
      message: 'kamu belum login',
      statusCode: 403
    })
  }
}
