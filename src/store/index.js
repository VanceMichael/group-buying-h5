import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { mockProducts, mockGroups, mockMyGroups } from '../mock/data'

export const useGroupBuyStore = defineStore('groupBuy', () => {
  const products = ref(mockProducts)
  const groups = ref(mockGroups)
  const myGroups = ref(mockMyGroups)
  const currentGroup = ref(null)

  const getProductById = (id) => {
    return products.value.find(p => p.id === id)
  }

  const getGroupById = (id) => {
    return groups.value.find(g => g.id === id)
  }

  const createGroup = (productId) => {
    const product = getProductById(productId)
    if (!product) return null

    const newGroup = {
      id: `group_${Date.now()}`,
      productId: productId,
      product: product,
      groupSize: product.groupSize,
      currentSize: 1,
      remainingSlots: product.groupSize - 1,
      status: 'ongoing',
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + product.groupDuration * 60 * 60 * 1000).toISOString(),
      members: [
        {
          id: 'user_1',
          name: '我',
          avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=default%20user%20avatar&image_size=square'
        }
      ],
      isCreator: true
    }

    groups.value.push(newGroup)
    myGroups.value.unshift({
      ...newGroup,
      joinedAt: new Date().toISOString()
    })

    return newGroup
  }

  const joinGroup = (groupId) => {
    const group = getGroupById(groupId)
    if (!group || group.status !== 'ongoing' || group.remainingSlots <= 0) {
      return { success: false, message: '拼团不可用' }
    }

    const currentMember = group.members.find(m => m.id === 'user_1')
    if (currentMember) {
      return { success: false, message: '您已参与此拼团' }
    }

    const newMember = {
      id: 'user_1',
      name: '我',
      avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=default%20user%20avatar&image_size=square'
    }

    group.members.push(newMember)
    group.currentSize += 1
    group.remainingSlots -= 1

    if (group.currentSize >= group.groupSize) {
      group.status = 'success'
    }

    myGroups.value.unshift({
      ...group,
      joinedAt: new Date().toISOString(),
      isCreator: false
    })

    return { success: true, group: group }
  }

  const updateGroupStatus = () => {
    const now = new Date()
    groups.value.forEach(group => {
      if (group.status === 'ongoing' && new Date(group.endTime) < now) {
        group.status = 'failed'
      }
    })

    myGroups.value.forEach(group => {
      if (group.status === 'ongoing' && new Date(group.endTime) < now) {
        group.status = 'failed'
      }
    })
  }

  return {
    products,
    groups,
    myGroups,
    currentGroup,
    getProductById,
    getGroupById,
    createGroup,
    joinGroup,
    updateGroupStatus
  }
})
