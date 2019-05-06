import { prouds, proud, user, group } from '@/main'

// State
const state = {
  prouds: []
}

// Mutations
const mutations = {
  SET_PROUDS(state, data) {
    state.prouds = data
  }
}

// Actions
const actions = {
  startListeningToProuds({ commit }) {
    prouds.on('value', snapshot => {
      const data = snapshot.val()
      if (data) {
        const dataArray = Object.keys(data).map(key => {
          return { ...data[key], uid: key }
        })
        commit('SET_PROUDS', dataArray)
      }
    })
  },
  stopListeningToProuds() {
    prouds.off()
  },
  createProud(proud) {
    prouds.push(proud)
  },
  removeProud({ rootState }, proudID) {
    // Get userID and activeGroup from state
    const {
      users: {
        user: { uid, activeGroup }
      }
    } = rootState
    // Update firebase prouds...
    proud(proudID).remove()
    // ...users...
    user(uid)
      .child('prouds')
      .child(proudID)
      .remove()
    // ...groups.
    group(activeGroup)
      .child('prouds')
      .child(proudID)
      .remove()
  }
}

// Getters
const getters = {
  getAllProuds: state => state.prouds,
  getProudById: state => uid => state.prouds.find(proud => proud.uid === uid), // CheckAgain: Is this needed?
  getProudsByGroup: (state, getters, { users: { user } }) =>
    state.prouds
      .filter(proud => {
        if (user) {
          return proud.group === user.activeGroup
        }
      })
      .sort((next, prev) => prev.created - next.created)
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}

/*
prouds = {
  proudID1: {
    message:
      'hej jag vill verkligen lyfta @uid1 och @uid2 för deras grymma jobb',
    creator: uid3,
    mentions: {
      uid1: true,
      uid2: true
    },
    group: groupID || null
  }
}
*/