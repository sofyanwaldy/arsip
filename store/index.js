import Vuex from 'vuex'

const createStore = () => {
  return new Vuex.Store({
    state: {
      counter: 0,
      isStories: false,
      darkmode: false
    },
    getters: {
      darkmode: (state) => state.darkmode
    },
    mutations: {
      CHANGE_DOODLE(state, content) {
        state.counter = content
      },
      ADS_PREMIUM_WP(state, content) {
        state.ads_premium_wp = content
      },
      ADS_PREMIUM_LIST(state, content) {
        state.ads_premium_list = content
      },
      ADS_PREMIUM_DETAIL(state, content) {
        state.ads_premium_detail = content
      },
      ADS_PREMIUM_DETAIL_2(state, content) {
        state.ads_premium_detail_2 = content
      },
      TIRTO_STORIES(state, content) {
        if (content && content !== undefined && content.length > 0) {
          state.isStories = true
          state.tirto_stories = content
        }
      },
      TIRTO_DARK_MODE(state, content) {
        state.darkmode = content
      },
      ADS_BANNER_KEYWORD(state, content) {
        state.ads_banner_keyword = content
      }
    },
    actions: {
      // nuxtServerInit is called by Nuxt.js before server-rendering every page
      // nuxtServerInit ({ commit }, { req }) {
      //   commit('CHANGE_DOODLE', '1')
      // }
    }
  })
}

export default createStore
